// src/Components/RoomsUI.jsx (IMPROVED)
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/axios";

export default function RoomsUI() {
    const [rooms, setRooms] = useState([]);
    const [formData, setFormData] = useState({
        roomNumber: "",
        roomType: "",
        pricePerNight: "",
        roomStatus: "Available",
    });
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            const res = await api.get("/rooms");
            setRooms(res.data);
        } catch (err) {
            toast.error("Failed to fetch rooms");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("/rooms", formData);
            setRooms((prev) => [...prev, res.data]);
            toast.success("Room added successfully! ✅");
            setFormData({
                roomNumber: "",
                roomType: "",
                pricePerNight: "",
                roomStatus: "Available",
            });
        } catch (err) {
            if (err.response?.data) {
                Object.values(err.response.data).forEach(msg => toast.error(msg));
            } else {
                toast.error("Failed to add room");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;

        try {
            await api.delete(`/rooms/${id}`);
            setRooms((prev) => prev.filter((r) => r.roomId !== id));
            toast.success("Room deleted 🗑️");
        } catch (err) {
            toast.error("Failed to delete room");
        }
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/rooms/${editData.roomId}`, editData);
            toast.success("Room updated ✅");
            setEditData(null);
            loadRooms();
        } catch (err) {
            toast.error("Failed to update room");
        }
    };

    const filteredRooms = filterStatus === "All"
        ? rooms
        : rooms.filter(r => r.roomStatus === filterStatus);

    const roomStats = {
        total: rooms.length,
        available: rooms.filter(r => r.roomStatus === "Available").length,
        occupied: rooms.filter(r => r.roomStatus === "Occupied").length,
        maintenance: rooms.filter(r => r.roomStatus === "Maintenance").length,
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg"
                >
                    <p className="text-sm opacity-90">Total Rooms</p>
                    <p className="text-3xl font-bold">{roomStats.total}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg"
                >
                    <p className="text-sm opacity-90">Available</p>
                    <p className="text-3xl font-bold">{roomStats.available}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white shadow-lg"
                >
                    <p className="text-sm opacity-90">Occupied</p>
                    <p className="text-3xl font-bold">{roomStats.occupied}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white shadow-lg"
                >
                    <p className="text-sm opacity-90">Maintenance</p>
                    <p className="text-3xl font-bold">{roomStats.maintenance}</p>
                </motion.div>
            </div>

            {/* Add Room Form */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-2xl p-6 mb-6"
            >
                <h2 className="text-2xl font-bold mb-4 text-white">Add New Room</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-white mb-2 font-semibold">Room Number *</label>
                            <input
                                type="text"
                                name="roomNumber"
                                placeholder="101"
                                value={formData.roomNumber}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2 font-semibold">Room Type *</label>
                            <select
                                name="roomType"
                                value={formData.roomType}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Suite">Suite</option>
                                <option value="Deluxe">Deluxe</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-white mb-2 font-semibold">Price/Night *</label>
                            <input
                                type="number"
                                name="pricePerNight"
                                placeholder="1000"
                                value={formData.pricePerNight}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2 font-semibold">Status</label>
                            <select
                                name="roomStatus"
                                value={formData.roomStatus}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                            >
                                <option>Available</option>
                                <option>Occupied</option>
                                <option>Maintenance</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 font-semibold shadow-lg disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Room"}
                    </button>
                </form>
            </motion.div>

            {/* Filter and Room List */}
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white">Rooms ({filteredRooms.length})</h2>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    >
                        <option>All</option>
                        <option>Available</option>
                        <option>Occupied</option>
                        <option>Maintenance</option>
                    </select>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {filteredRooms.map((room, index) => (
                            <motion.div
                                key={room.roomId}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className={`rounded-lg p-4 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                                    room.roomStatus === "Available" ? "bg-green-100" :
                                        room.roomStatus === "Occupied" ? "bg-red-100" :
                                            "bg-yellow-100"
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-800">{room.roomNumber}</p>
                                        <p className="text-sm text-gray-600">{room.roomType}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        room.roomStatus === "Available" ? "bg-green-500 text-white" :
                                            room.roomStatus === "Occupied" ? "bg-red-500 text-white" :
                                                "bg-yellow-500 text-white"
                                    }`}>
                    {room.roomStatus}
                  </span>
                                </div>

                                <p className="text-xl font-bold text-gray-800 mb-4">
                                    ₹{room.pricePerNight}/night
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditData(room)}
                                        className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition text-sm font-semibold"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(room.roomId)}
                                        className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition text-sm font-semibold"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredRooms.length === 0 && (
                    <div className="text-center py-12 text-white">
                        <p className="text-xl">No rooms found</p>
                        <p className="text-sm mt-2">Add your first room to get started!</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setEditData(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Edit Room</h3>

                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold">Room Number</label>
                                    <input
                                        type="text"
                                        name="roomNumber"
                                        value={editData.roomNumber}
                                        onChange={handleEditChange}
                                        className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold">Room Type</label>
                                    <select
                                        name="roomType"
                                        value={editData.roomType}
                                        onChange={handleEditChange}
                                        className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                                        required
                                    >
                                        <option value="Single">Single</option>
                                        <option value="Double">Double</option>
                                        <option value="Suite">Suite</option>
                                        <option value="Deluxe">Deluxe</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold">Price/Night</label>
                                    <input
                                        type="number"
                                        name="pricePerNight"
                                        value={editData.pricePerNight}
                                        onChange={handleEditChange}
                                        min="0"
                                        step="0.01"
                                        className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold">Status</label>
                                    <select
                                        name="roomStatus"
                                        value={editData.roomStatus}
                                        onChange={handleEditChange}
                                        className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                                    >
                                        <option>Available</option>
                                        <option>Occupied</option>
                                        <option>Maintenance</option>
                                    </select>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setEditData(null)}
                                        className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}