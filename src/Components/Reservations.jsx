// src/Components/Reservations.jsx (IMPROVED)
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import api from "../api/axios";

function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        try {
            const res = await api.get("/reservations");
            setReservations(res.data);
        } catch (err) {
            console.error("Failed to load reservations", err);
            toast.error("Failed to load reservations");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this reservation?")) {
            return;
        }

        try {
            await api.delete(`/reservations/${id}`);
            toast.success("Reservation cancelled successfully!");
            loadReservations();
        } catch (err) {
            toast.error("Failed to cancel reservation");
        }
    };

    const calculateNights = (checkIn, checkOut) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return nights;
    };

    const getStatusColor = (checkIn, checkOut) => {
        const today = new Date();
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (today < checkInDate) return "bg-blue-100 border-blue-500";
        if (today >= checkInDate && today <= checkOutDate) return "bg-green-100 border-green-500";
        return "bg-gray-100 border-gray-500";
    };

    const getStatusText = (checkIn, checkOut) => {
        const today = new Date();
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (today < checkInDate) return "Upcoming";
        if (today >= checkInDate && today <= checkOutDate) return "Active";
        return "Completed";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-2xl p-6"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">
                        Reservations ({reservations.length})
                    </h2>

                    <button
                        onClick={loadReservations}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                        🔄 Refresh
                    </button>
                </div>

                <div className="grid gap-4">
                    <AnimatePresence>
                        {reservations.length > 0 ? (
                            reservations.map((r, index) => (
                                <motion.div
                                    key={r.reservationId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`${getStatusColor(r.checkInDate, r.checkoutDate)} rounded-lg p-6 border-l-4 shadow-lg hover:shadow-2xl transition-all duration-300`}
                                >
                                    <div className="grid md:grid-cols-5 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 font-semibold">Guest</p>
                                            <p className="text-lg font-bold text-gray-800">
                                                {r.guest?.firstName} {r.guest?.lastName}
                                            </p>
                                            <p className="text-sm text-gray-600">📞 {r.guest?.phone}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-600 font-semibold">Room</p>
                                            <p className="text-lg font-bold text-gray-800">{r.room?.roomNumber}</p>
                                            <p className="text-sm text-gray-600">{r.room?.roomType}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-600 font-semibold">Check-In</p>
                                            <p className="text-lg font-bold text-gray-800">{r.checkInDate}</p>
                                            <p className="text-sm text-gray-600">
                                                {calculateNights(r.checkInDate, r.checkoutDate)} night(s)
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-600 font-semibold">Check-Out</p>
                                            <p className="text-lg font-bold text-gray-800">{r.checkoutDate}</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                                                getStatusText(r.checkInDate, r.checkoutDate) === "Upcoming" ? "bg-blue-500 text-white" :
                                                    getStatusText(r.checkInDate, r.checkoutDate) === "Active" ? "bg-green-500 text-white" :
                                                        "bg-gray-500 text-white"
                                            }`}>
                        {getStatusText(r.checkInDate, r.checkoutDate)}
                      </span>
                                        </div>

                                        <div className="flex flex-col justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold">Total Amount</p>
                                                <p className="text-2xl font-bold text-green-600">₹{r.totalAmount}</p>
                                            </div>
                                            <button
                                                onClick={() => handleCancel(r.reservationId)}
                                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm font-semibold"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-white">
                                <p className="text-xl">No reservations found</p>
                                <p className="text-sm mt-2">Create a reservation to get started!</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

export default Reservations;