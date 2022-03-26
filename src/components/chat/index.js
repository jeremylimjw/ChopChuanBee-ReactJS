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
    const [channels, setChannels] = useState(tempChannels);
    const [chat, setChat] = useState(null);

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

    return (
        <>
            <div id="chat" style={styles.container}>
                { chat &&
                    <ChatBox 
                        key={chat.id} // To force component re-render
                        chat={chat} 
                        setChat={setChat} 
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

const tempChannels = [
    {
        id: '1',
      title: 'Ant Design Title 1',
    },
];