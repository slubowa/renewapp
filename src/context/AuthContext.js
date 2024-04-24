import React, { createContext, useContext, useState, useEffect } from 'react';
import { validateToken } from "../backend/services/userService.js"; // 

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
    
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const initializeUserSession = async () => {
            setIsLoading(true);
            try {
                const {user} = await validateToken();
                setCurrentUser({ ...user, isLoggedIn: true });
            } catch (error) {
                console.error('Session validation error:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('userDetails');
                setCurrentUser(null);
                
            }
            setIsLoading(false);
        };

        initializeUserSession();
    }, []);

    const login = (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userDetails', JSON.stringify(user));
        setCurrentUser({ ...user, isLoggedIn: true });
        setIsLoading(false); 
    };
    
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userDetails');
        setCurrentUser(null);
        setIsLoading(false); 
        window.location.href = '/login'
    };

    const value = { currentUser, isLoading, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
