import React, { useState } from 'react';
import { bookingService } from '../services/roomService.js';

const BookingForm = ({ roomId, roomPrice, onSuccess }) => {
    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
        specialRequests: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const calculateNights = () => {
        if (formData.checkIn && formData.checkOut) {
            const start = new Date(formData.checkIn);
            const end = new Date(formData.checkOut);
            const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            return nights > 0 ? nights : 0;
        }
        return 0;
    };

    const calculateTotal = () => {
        return calculateNights() * roomPrice;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userId = localStorage.getItem('userId');
            const bookingData = {
                ...formData,
                totalAmount: calculateTotal(),
                nights: calculateNights(),
            };

            await bookingService.createBooking(roomId, userId, bookingData);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Complete Your Booking
            </h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Check-in Date */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Check-in Date
                    </label>
                    <input
                        type="date"
                        min={today}
                        value={formData.checkIn}
                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                {/* Check-out Date */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Check-out Date
                    </label>
                    <input
                        type="date"
                        min={formData.checkIn || today}
                        value={formData.checkOut}
                        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                {/* Number of Guests */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Number of Guests
                    </label>
                    <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <option key={num} value={num}>
                                {num} {num === 1 ? 'Guest' : 'Guests'}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Special Requests */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Special Requests (Optional)
                    </label>
                    <textarea
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                        placeholder="Any special requirements..."
                    />
                </div>

                {/* Booking Summary */}
                {calculateNights() > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Number of Nights:</span>
                            <span className="font-semibold">{calculateNights()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Price per Night:</span>
                            <span className="font-semibold">₹{roomPrice}</span>
                        </div>
                        <div className="border-t border-blue-300 pt-2 flex justify-between">
                            <span className="font-bold text-gray-800">Total Amount:</span>
                            <span className="text-2xl font-bold text-blue-600">
                ₹{calculateTotal()}
              </span>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || calculateNights() === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
            </form>
        </div>
    );
};

export default BookingForm;
