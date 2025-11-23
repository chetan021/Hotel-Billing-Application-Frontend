import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import api from "../api/axios";

export default function AssignRoom() {
    const { guestId } = useParams();
    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);
    const [guest, setGuest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        roomId: "",
        checkInDate: "",
        checkoutDate: ""
    });

    useEffect(() => {
        loadData();
    }, [guestId]);

    const loadData = async () => {
        try {
            // Load guest details
            const guestRes = await api.get(`/guests/${guestId}`);
            setGuest(guestRes.data);

            // Load available rooms
            const roomsRes = await api.get("/rooms");
            // Filter only available rooms
            const availableRooms = roomsRes.data.filter(
                room => room.roomStatus === "Available"
            );
            setRooms(availableRooms);

            // Set default check-in to today
            const today = new Date().toISOString().split('T')[0];
            const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

            setFormData(prev => ({
                ...prev,
                checkInDate: today,
                checkoutDate: tomorrow
            }));

        } catch (error) {
            console.error("Failed to load data:", error);
            toast.error("Failed to load data. Please try again.");
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateDates = () => {
        const checkIn = new Date(formData.checkInDate);
        const checkOut = new Date(formData.checkoutDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!formData.checkInDate || !formData.checkoutDate) {
            toast.error("Please select both check-in and check-out dates");
            return false;
        }

        if (checkIn < today) {
            toast.error("Check-in date cannot be in the past");
            return false;
        }

        if (checkOut <= checkIn) {
            toast.error("Check-out date must be after check-in date");
            return false;
        }

        const daysDiff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        if (daysDiff > 30) {
            toast.error("Maximum stay is 30 days");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.roomId) {
            toast.error("Please select a room");
            return;
        }

        if (!validateDates()) {
            return;
        }

        setSubmitting(true);

        try {
            // Create reservation with proper DTO structure
            const reservationData = {
                guestId: parseInt(guestId),
                roomId: parseInt(formData.roomId),
                checkInDate: formData.checkInDate,
                checkoutDate: formData.checkoutDate
            };

            console.log("Sending reservation data:", reservationData);

            const response = await api.post("/reservations", reservationData);

            console.log("Reservation response:", response.data);

            toast.success("Room assigned successfully! 🎉");

            // Navigate to reservations page after a short delay
            setTimeout(() => {
                navigate("/reservations");
            }, 1500);

        } catch (error) {
            console.error("Failed to assign room:", error);

            if (error.response?.data) {
                // Handle validation errors
                const errorData = error.response.data;

                if (typeof errorData === 'object' && !Array.isArray(errorData)) {
                    // Multiple validation errors
                    Object.entries(errorData).forEach(([field, message]) => {
                        toast.error(`${field}: ${message}`);
                    });
                } else if (typeof errorData === 'string') {
                    toast.error(errorData);
                } else {
                    toast.error("Failed to assign room");
                }
            } else if (error.response?.status === 409) {
                toast.error("Room is already booked for these dates");
            } else if (error.response?.status === 404) {
                toast.error("Guest or Room not found");
            } else {
                toast.error("Failed to assign room. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const calculateNights = () => {
        if (!formData.checkInDate || !formData.checkoutDate) return 0;

        const checkIn = new Date(formData.checkInDate);
        const checkOut = new Date(formData.checkoutDate);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        return nights > 0 ? nights : 0;
    };

    const calculateTotal = () => {
        if (!formData.roomId) return 0;

        const selectedRoom = rooms.find(r => r.roomId === parseInt(formData.roomId));
        if (!selectedRoom) return 0;

        const nights = calculateNights();
        return nights * selectedRoom.pricePerNight;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (!guest) {
        return (
            <div className="text-center py-12">
                <p className="text-xl text-red-500">Guest not found</p>
                <button
                    onClick={() => navigate("/guests")}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
                >
                    Back to Guests
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 max-w-4xl mx-auto"
        >
            <div className="bg-white rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                    Assign Room to Guest
                </h2>

                {/* Guest Info Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 font-semibold">Guest Details</p>
                    <p className="text-xl font-bold text-gray-800">
                        {guest.firstName} {guest.lastName}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>📞 {guest.phone}</span>
                        {guest.email && <span>📧 {guest.email}</span>}
                    </div>
                </div>

                {rooms.length === 0 ? (
                    <div className="text-center py-8 bg-yellow-50 rounded-lg">
                        <p className="text-lg text-yellow-700 mb-4">
                            No available rooms at the moment
                        </p>
                        <button
                            onClick={() => navigate("/rooms")}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Manage Rooms
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Room Selection */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Select Room *
                            </label>
                            <select
                                name="roomId"
                                value={formData.roomId}
                                onChange={handleChange}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                required
                            >
                                <option value="">Choose a room...</option>
                                {rooms.map(room => (
                                    <option key={room.roomId} value={room.roomId}>
                                        Room {room.roomNumber} - {room.roomType} - ₹{room.pricePerNight}/night
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Selection */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Check-In Date *
                                </label>
                                <input
                                    type="date"
                                    name="checkInDate"
                                    value={formData.checkInDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Check-Out Date *
                                </label>
                                <input
                                    type="date"
                                    name="checkoutDate"
                                    value={formData.checkoutDate}
                                    onChange={handleChange}
                                    min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Summary Card */}
                        {formData.roomId && calculateNights() > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-l-4 border-green-500"
                            >
                                <p className="text-sm text-gray-600 font-semibold mb-2">
                                    Reservation Summary
                                </p>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Number of Nights:</span>
                                        <span className="font-bold text-gray-800">
                                            {calculateNights()} night(s)
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Price per Night:</span>
                                        <span className="font-bold text-gray-800">
                                            ₹{rooms.find(r => r.roomId === parseInt(formData.roomId))?.pricePerNight}
                                        </span>
                                    </div>
                                    <div className="border-t-2 border-green-200 pt-2 mt-2">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold text-gray-800">
                                                Total Amount:
                                            </span>
                                            <span className="text-2xl font-bold text-green-600">
                                                ₹{calculateTotal()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/guests")}
                                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-300 font-semibold"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || !formData.roomId}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Assigning...
                                    </span>
                                ) : (
                                    "Confirm Reservation"
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </motion.div>
    );
}