import api from './axios.js';

export const roomService = {
    getAllRooms: async () => {
        try {
            const response = await api.get('/rooms/all');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getAvailableRooms: async () => {
        try {
            const response = await api.get('/rooms/all-available-rooms');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getRoomById: async (id) => {
        try {
            const response = await api.get(`/rooms/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    searchRooms: async (filters) => {
        try {
            const response = await api.get('/rooms/search', { params: filters });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};
