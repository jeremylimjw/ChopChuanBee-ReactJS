
import { useState, useEffect, useContext, createContext } from "react";
import { useApp } from "./AppProvider";

const ChatContext = createContext();

export function useChatProvider() {
    return useContext(ChatContext);
}

export function ChatProvider({ children }) {
    // const { user, handleHttpError } = useApp();
    // const navigate = useNavigate();

    // const [user, setUser] = useState(null);
    // console.log(user) // user null first on page refresh

    const value = {  }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}