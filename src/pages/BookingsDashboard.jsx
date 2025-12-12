import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/roomService.js';

const BookingsDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await bookingService.getAllBookings();
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await bookingService.cancelBooking(bookingId);
                fetchBookings();
            } catch (error) {
                alert('Failed to cancel booking');
            }
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            CONFIRMED: 'bg-green-100 text-green-800',
            PENDING: 'bg-yellow-100 text-yellow-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    My Bookings
                </h1>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                {booking.room?.roomType}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Check-in</p>
                                                <p className="font-semibold">{booking.checkIn}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Check-out</p>
                                                <p className="font-semibold">{booking.checkOut}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Guests</p>
                                                <p className="font-semibold">{booking.guests}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Total Amount</p>
                                                <p className="font-semibold text-blue-600">
                                                    ₹{booking.totalAmount}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {booking.status === 'CONFIRMED' && (
                                        <button
                                            onClick={() => handleCancelBooking(booking.id)}
                                            className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && bookings.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg">
                        <p className="text-gray-500 text-lg">No bookings found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingsDashboard;
