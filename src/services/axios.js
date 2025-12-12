import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const roomService = {
  getAllRooms: () => api.get('/rooms/all'),
  getAvailableRooms: () => api.get('/rooms/all-available-rooms'),
  getRoomById: (id) => api.get(`/rooms/${id}`),
};

export const bookingService = {
  createBooking: (roomId, userId, bookingData) =>
      api.post(`/bookings/book-room/${roomId}/${userId}`, bookingData),
  getAllBookings: () => api.get('/bookings/all'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.delete(`/bookings/cancel/${id}`),
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export default api;
