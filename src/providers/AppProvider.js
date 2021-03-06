
import { useState, useEffect, useContext, createContext } from "react";
import { httpLogout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const AppContext = createContext();

export function useApp() {
    return useContext(AppContext);
}

export function AppProvider({ children }) {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    /**
     * On first load, check for existing user stored in session
     */
    useEffect(() => {
        let userSession = JSON.parse(sessionStorage.getItem("user")) || null;

        if (userSession != null) {
            setUser(userSession);
        }
    }, [])

    /**
     * Remove the logged in user's session
     */
    function removeSession() {
        sessionStorage.setItem("user", JSON.stringify(null));
        document.cookie = `${process.env.REACT_APP_COOKIE_NAME}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`
        setUser(null);
        navigate('/login');
    }

    /**
     * Requests backend to remove user's token, and then clear session in the browser
     */
    function logout() {
        httpLogout().finally(() => {
            removeSession();
        })
    }

    /**
     * Wrapper to handle HTTP errors
     */
    function handleHttpError(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 401) {
                removeSession();
                message.error(error.response.data);
                throw Error(error);
            } else if (error.response.status === 333) {
                removeSession();
                message.error('Login session timed out. Please login again.');
                throw Error('Login session timed out. Please login again.');
            } else {
                console.log(error.response.data)
                message.error(typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data));
                throw Error(error.response.data);
            }
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            message.error('The request was made but no response was received.')
            console.error(error)
            throw error.request
        } else {
            // Something happened in setting up the request that triggered an Error
            message.error('Something happened in setting up the request that triggered an Error.')
            console.error(error)
            throw error.message;
        }
    }

    /**
     * Checks if logged in user has view access to this view
     * @param {string} view - the view name, refer to database 'views' table for full list of options
     * @returns true if have read access, false if no read access
     */
    function hasViewAccessTo(view) {
        if (user == null) return false;
        if (user.role.name === 'Admin' || user.access_rights[view] != null) return true;
        return false;
    }

    /**
     * Checks if logged in user has write access to this view
     * @param {string} view - the view name, refer to database 'views' table for full list of options
     * @returns true if have write access, false if no write access
     */
    function hasWriteAccessTo(view) {
        if (user == null) return false;
        if (user.role.name === 'Admin' || user.access_rights[view]?.has_write_access) return true;
        return false;
    }

    const value = { user, setUser, logout, removeSession, hasViewAccessTo, hasWriteAccessTo, handleHttpError }

    return (
        <AppContext.Provider
            value={value}>
            {children}
        </AppContext.Provider>
    )
}