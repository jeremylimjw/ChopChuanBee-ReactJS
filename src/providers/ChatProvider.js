
import { useState, useEffect, useContext, createContext, useCallback } from "react";
import { useApp } from "./AppProvider";
import { io } from "socket.io-client";

const ChatContext = createContext();

export function useChatProvider() {
    return useContext(ChatContext);
}

export function ChatProvider({ children }) {
    const { user } = useApp();
    
    const [socket, setSocket] = useState();

    useEffect(() => {
        if (user === null) return;

        const socket = io(process.env.REACT_APP_SOCKET_URL, { query: { id: user.id } });
        setSocket(socket);

        return () => socket.close();
    }, [user])
  
  
    useEffect(() => {
        if (!socket) return;
  
        socket.on("message", data => {
            console.log('message', data)
            // registerMessage(data);

            // updateLastReceivedCallBack(data.channelId);
            // updateLastReadCallBack(data.channelId, data.message.from);
        })

        socket.on("get_last_seens", data => {
            console.log('get_last_seens', data)
            // initLastSeens(data);
        })

        socket.on("online", data => {
            console.log('online', data)
            // updateLastSeen(data._id, data.lastSeen);
        })

        socket.on("offline", data => {
            console.log('offline', data)
            // updateLastSeen(data._id, data.lastSeen);
        })


        socket.on("update_last_received", data => {
            console.log('update_last_received', data)
            // handleLastReceived(data);
        })

        socket.on("update_last_read", data => {
            console.log('update_last_read', data)
            // handleLastRead(data);
        })
        
  
        return () => {
            socket.off("message");
            socket.off("get_last_seens");
            socket.off("online");
            socket.off("offline");
            socket.off("update_last_received");
            socket.off("update_last_read");
        }
    
    }, [socket])

    const emitNewChannel = useCallback(
        (newChannel) => {
            socket.emit("new_channel", {
                newChannel: newChannel,
            });
        },
        [socket],
    )

    const value = { 
        socket,
        emitNewChannel 
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}