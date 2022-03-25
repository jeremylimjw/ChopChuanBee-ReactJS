import React, { useState } from 'react'
import './style.css'
import ChatBox from './ChatBox';
import Channels from './Channels';
import NewGroupModal from './NewGroupModal';
import NewDirectModal from './NewDirectModal';

export default function Chat() {

    const [chat, setChat] = useState(null);
    const [isDirectModalVisible, setIsDirectModalVisible] = useState(false);
    const [isNewGroupModalVisible, setIsNewGroupModalVisible] = useState(false);

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
                    chat={chat} 
                    setChat={setChat} 
                    setIsDirectModalVisible={setIsDirectModalVisible}
                    setIsNewGroupModalVisible={setIsNewGroupModalVisible}
                />

            </div>
            
            <NewDirectModal
                isModalVisible={isDirectModalVisible}
                setIsModalVisible={setIsDirectModalVisible}
            />

            <NewGroupModal 
                isModalVisible={isNewGroupModalVisible}
                setIsModalVisible={setIsNewGroupModalVisible}
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