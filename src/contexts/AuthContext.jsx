import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const initAuth = () => {
            const currentUser = authService.getCurrentUser();
            const token = localStorage.getItem('authToken');

            if (currentUser && token) {
                setUser(currentUser);
                setIsAuthenticated(true);
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = useCallback(async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setUser(data.user);
            setIsAuthenticated(true);
            return data;
        } catch (error) {
            throw error;
        }
    }, []);

    const register = useCallback(async (userData) => {
        try {
            const data = await authService.register(userData);
            return data;
        } catch (error) {
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
