// ✅ CORRECT - With error handling
import apiClient from "./axios.js";

export const userService = {
    getAllUsers: async () => {
        try {
            const response = await apiClient.get("/users/all");
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getUserById: async (id) => {
        try {
            const response = await apiClient.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    createUser: async (userData) => {
        try {
            const response = await apiClient.post("/users/create", userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateUser: async (id, userData) => {
        try {
            const response = await apiClient.put(`/users/update/${id}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await apiClient.delete(`/users/delete/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    changePassword: async (id, oldPassword, newPassword) => {
        try {
            const response = await apiClient.put(`/users/${id}/change-password`, {
                oldPassword,
                newPassword,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    toggleUserStatus: async (id, isActive) => {
        try {
            const response = await apiClient.put(`/users/${id}/status`, { isActive });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default userService;
