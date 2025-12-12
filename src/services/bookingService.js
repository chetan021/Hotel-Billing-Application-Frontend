import api from './axios.js';

export const bookingService = {
    createBooking: async (roomId, userId, bookingData) => {
        try {
            const response = await api.post(
                `/bookings/book-room/${roomId}/${userId}`,
                bookingData
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getAllBookings: async () => {
        try {
            const response = await api.get('/bookings/all');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getUserBookings: async (userId) => {
        try {
            const response = await api.get(`/bookings/user/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getBookingById: async (id) => {
        try {
            const response = await api.get(`/bookings/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    cancelBooking: async (id) => {
        try {
            const response = await api.delete(`/bookings/cancel/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};
