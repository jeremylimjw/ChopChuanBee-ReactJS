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
    const [chat, setChat] = useState(null)

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

            const newChannels = [...channels]
            const index = newChannels.findIndex(x => x.id === newText.channel_id);
            
            if (chat?.id !== newText.channel_id) {
                // Update unread count and last text in channel list
                if (index > -1) {
                    newChannels[index] = {
                        ...newChannels[index], 
                        unread_count: newChannels[index].unread_count+1,
                        last_text: newText, 
                    }
                }

                // Update last received timestamp
                socket.emit('update_last_received', {
                    employee_id: user.id,
                    channel_id: newText.channel_id,
                    timestamp: new Date(),
                })
            } else {
                // Append the new text in chatbox
                setChat({...chat, texts: [newText, ...chat.texts]})

                // Update last read timestamp
                socket.emit('update_last_read', {
                    employee_id: user.id,
                    channel_id: newText.channel_id,
                    timestamp: new Date(),
                })
            }

            // Shift channel to first item of the array list
            const channel = newChannels.splice(index, 1);
            setChannels([...channel, ...newChannels])
            
        })
  
        return () => {
            socket.off("message");
        }
    
    }, [socket, user, chat, setChat, channels, setChannels])

    return (
        <>
        { user != null && 
            <>
                <div id="chat" style={styles.container}>
                    { chat &&
                        <ChatBox 
                            key={chat.id} // To force component re-render
                            chat={chat}
                            setChat={setChat}
                            channels={channels}
                            setChannels={setChannels}
                        />
                    }
                    <Channels 
                        loading={loading}
                        setLoading={setLoading}
                        channels={channels}
                        setChannels={setChannels}
                        chat={chat}
                        setChat={setChat}
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