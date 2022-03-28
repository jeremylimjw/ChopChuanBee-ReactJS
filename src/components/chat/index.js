import React, { useState, useEffect, useCallback } from 'react'
import './style.css'
import ChatBox from './ChatBox';
import Channels from './Channels';
import NewGroupModal from './NewGroupModal';
import NewDirectModal from './NewDirectModal';
import { useChatProvider } from '../../providers/ChatProvider';
import { ChatApiHelper } from '../../api/ChatApiHelper';
import { useApp } from '../../providers/AppProvider';

export default function Chat() {

    const { user, handleHttpError } = useApp();
    const { socket } = useChatProvider();

    const [loading, setLoading] = useState(false);
    const [channels, setChannels] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);

    const [isDirectModalVisible, setIsDirectModalVisible] = useState(false);
    const [isNewGroupModalVisible, setIsNewGroupModalVisible] = useState(false);
    
    // Load all channels
    useEffect(() => {
        if (user == null) return;

        setLoading(true);
        ChatApiHelper.getChannels({ employee_id: user.id })
            .then(channels => {
                setChannels(channels);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    
    }, [user, setChannels, handleHttpError])

    const handleNewChannelEvent = useCallback(
        (newChannel) => {
            setChannels([newChannel, ...channels]);
        },
        [channels, setChannels],
    )
    
    useEffect(() => {
        if (!socket) return;
  
        socket.on("new_channel", data => {
            handleNewChannelEvent(data.newChannel);
        })
  
        return () => {
            socket.off("new_channel");
        }
    
    }, [socket, handleNewChannelEvent])
    
    useEffect(() => {
        if (!socket) return;

        socket.on("message", data => {
            const { newText } = data;
            console.log('message', data.newText.text)
            
            if (selectedChatId !== newText.channel_id) {
                const newChannels = [...channels]
                const index = newChannels.findIndex(x => x.id === newText.channel_id);
                if (index > -1) {
                    newChannels[index] = {
                        ...newChannels[index], 
                        unread_count: newChannels[index].unread_count+1,
                        last_text: newText, 
                    }
                    setChannels(newChannels);
                }
                // Update last received timestamp
                socket.emit('update_last_received', {
                    employee_id: user.id,
                    channel_id: newText.channel_id,
                    timestamp: new Date(),
                })
            } else {
                // Update last read timestamp
                socket.emit('update_last_read', {
                    employee_id: user.id,
                    channel_id: newText.channel_id,
                    timestamp: new Date(),
                })
            }
        })
  
        return () => {
            socket.off("message");
        }
    
    }, [socket, user, selectedChatId, channels, setChannels])

    return (
        <>
        { user != null && 
            <>
                <div id="chat" style={styles.container}>
                    { selectedChatId &&
                        <ChatBox 
                            key={selectedChatId} // To force component re-render
                            selectedChatId={selectedChatId} 
                            setSelectedChatId={setSelectedChatId} 
                            channels={channels}
                            setChannels={setChannels}
                        />
                    }
                    <Channels 
                        loading={loading}
                        setLoading={setLoading}
                        channels={channels}
                        setChannels={setChannels}
                        selectedChatId={selectedChatId} 
                        setSelectedChatId={setSelectedChatId} 
                        setIsDirectModalVisible={setIsDirectModalVisible}
                        setIsNewGroupModalVisible={setIsNewGroupModalVisible}
                    />

                </div>
                
                <NewDirectModal
                    isModalVisible={isDirectModalVisible}
                    setIsModalVisible={setIsDirectModalVisible}
                    handleNewChannelEvent={handleNewChannelEvent}
                />

                <NewGroupModal 
                    isModalVisible={isNewGroupModalVisible}
                    setIsModalVisible={setIsNewGroupModalVisible}
                    handleNewChannelEvent={handleNewChannelEvent}
                />
            </>
        }
        </>
    )
}

const styles = {
    container: {
        position: 'fixed',
        bottom: 0,
        right: 10,
        display: 'flex',
        zIndex: 10,
    },
}