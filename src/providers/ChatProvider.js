
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

        const socket = io(process.env.REACT_APP_SOCKET_URL, { query: { id: user.id, name: user.name } });
        setSocket(socket);

        return () => socket.close();
    }, [user])

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