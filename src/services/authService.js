import api from './axios.js';

export const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, userId, user } = response.data;

            if (token) {
                localStorage.setItem('authToken', token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('user', JSON.stringify(user));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },
};
