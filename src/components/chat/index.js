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
    const [chat, setChat] = useState(null);
    const [lastSeenStore, setLastSeenStore] = useState({});

    const [isDirectModalVisible, setIsDirectModalVisible] = useState(false);
    const [isNewGroupModalVisible, setIsNewGroupModalVisible] = useState(false);

    // Retrieve all last seens from all channels
    const retrieveLastSeens = useCallback(
        (channel_ids) => {
            ChatApiHelper.getLastSeens(channel_ids)
                .then(newLastSeens => {
                    setLastSeenStore(newLastSeens)
                });
        },
        [setLastSeenStore],
    )
    
    // Load all channels
    useEffect(() => {
        if (user == null) return;

        setLoading(true);
        ChatApiHelper.getChannels({ employee_id: user.id })
            .then(channels => {
                setChannels(channels);
                setLoading(false);

                // Retrieve last seens from the channels
                retrieveLastSeens(channels.map(x => x.id))
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    
    }, [user, setChannels, handleHttpError, retrieveLastSeens])

    const handleNewChannelEvent = useCallback(
        (newChannel) => {
            const newChannels = [newChannel, ...channels];
            setChannels(newChannels);

            // Retrieve last seens including the new channel users
            retrieveLastSeens(newChannels.map(x => x.id));
        },
        [channels, setChannels, retrieveLastSeens],
    )
    
    // On new channel socket event
    useEffect(() => {
        if (!socket) return;
  
        socket.on("new_channel", data => {
            handleNewChannelEvent(data.newChannel);
        })
  
        return () => {
            socket.off("new_channel");
        }
    
    }, [socket, handleNewChannelEvent])
    
    // On new last seen socket event
    useEffect(() => {
        if (!socket) return;
  
        socket.on("update_last_seen", data => {
            const newLastSeens = {...lastSeenStore, [data.employee_id]: data.timestamp }
            setLastSeenStore(newLastSeens)
        })
  
        return () => {
            socket.off("update_last_seen");
        }
    
    }, [socket, lastSeenStore, setLastSeenStore])
    
    // On new message socket event
    useEffect(() => {
        if (!socket) return;

        socket.on("message", data => {
            const { newText } = data;

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

    const deleteChat = useCallback(
        (channel_id) => {
            if (chat?.id === channel_id) {
                setChat(null);
            }
    
            const newChannels = channels.filter(x => x.id !== channel_id);
            setChannels(newChannels);
        },
      [chat, setChat, channels, setChannels],
    )
    
    // On delete chat event
    useEffect(() => {
        if (!socket) return;
  
        socket.on("remove_channel", data => {
            deleteChat(data.channel_id);
        })
  
        return () => {
            socket.off("remove_channel");
        }
    
    }, [socket, deleteChat])

    const removeParticipant = useCallback(
        (channel_id, employee_id) => {
            // If user is being removed, delete channel
            if (employee_id === user.id) {
                setChannels(channels.filter(x => x.id !== channel_id));

                if (chat?.id === channel_id) {
                    setChat(null); // Close the chat if its opened
                }
            }
            else if (chat?.id === channel_id) { // If chat is just opened
                const newParticipants = chat.participants.filter(x => x.employee_id !== employee_id);
                setChat({ ...chat, participants: newParticipants });
            }
    
        },
      [user, chat, setChat, channels, setChannels],
    )
    
    // On delete chat event
    useEffect(() => {
        if (!socket) return;
  
        socket.on("remove_channel_participant", data => {
            removeParticipant(data.channel_id, data.employee_id);
        })
  
        return () => {
            socket.off("remove_channel_participant");
        }
    
    }, [socket, removeParticipant])

    const addParticipant = useCallback(
        (newParticipant) => {
            // If new participant is the user, refresh all channels to get unread_count and last texts, etc.
            if (newParticipant.employee_id === user.id) {
                ChatApiHelper.getChannels({ employee_id: user.id })
                    .then(channels => {
                        setChannels(channels);

                        // Retrieve last seens from the channels
                        retrieveLastSeens(channels.map(x => x.id))
                    })
                    .catch(handleHttpError)
            }
            // If chat is opened
            if (chat?.id === newParticipant.channel_id) {
                const newParticipants = [...chat.participants, newParticipant];
                setChat({ ...chat, participants: newParticipants });
            }
    
        },
      [user, chat, setChat, setChannels, handleHttpError, retrieveLastSeens],
    )
    
    // On delete chat event
    useEffect(() => {
        if (!socket) return;
  
        socket.on("add_channel_participant", data => {
            addParticipant(data.newParticipant);
        })
  
        return () => {
            socket.off("add_channel_participant");
        }
    
    }, [socket, addParticipant])

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
                            lastSeenStore={lastSeenStore}
                        />
                    }
                    <Channels 
                        loading={loading}
                        setLoading={setLoading}
                        channels={channels}
                        setChannels={setChannels}
                        chat={chat}
                        setChat={setChat}
                        lastSeenStore={lastSeenStore}
                        setIsDirectModalVisible={setIsDirectModalVisible}
                        setIsNewGroupModalVisible={setIsNewGroupModalVisible}
                    />

                </div>
                
                <NewDirectModal
                    channels={channels}
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