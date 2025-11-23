// src/Components/Guest.jsx (IMPROVED)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function Guest() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
    });

    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingGuest, setEditingGuest] = useState(null);

    useEffect(() => {
        loadGuests();
    }, []);

    const loadGuests = async () => {
        try {
            const res = await api.get("/guests");
            setGuests(res.data);
        } catch (err) {
            console.error("Load guests failed", err);
            if (err.response?.status === 403 || err.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                navigate("/login");
            } else {
                toast.error("Failed to load guests");
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingGuest) {
                // Update existing guest
                await api.put(`/guests/${editingGuest.id}`, formData);
                toast.success("Guest updated successfully! ✅");
                setEditingGuest(null);
            } else {
                // Create new guest
                const res = await api.post("/guests", formData);
                toast.success("Guest saved successfully! ✅");

                // Ask if user wants to assign room
                const assignRoom = window.confirm(
                    `Guest saved! Would you like to assign a room for ${res.data.firstName}?`
                );

                if (assignRoom) {
                    navigate(`/assign-room/${res.data.id}`);
                    return;
                }
            }

            // Reset form and reload guests
            setFormData({
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
                address: "",
            });
            loadGuests();
        } catch (err) {
            console.error("Save failed:", err.response || err);

            if (err.response?.data) {
                // Handle validation errors
                const errors = err.response.data;
                if (typeof errors === 'object') {
                    Object.values(errors).forEach(msg => toast.error(msg));
                } else {
                    toast.error(errors);
                }
            } else {
                toast.error("Failed to save guest");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (guest) => {
        setEditingGuest(guest);
        setFormData({
            firstName: guest.firstName,
            lastName: guest.lastName,
            phone: guest.phone,
            email: guest.email,
            address: guest.address,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this guest?")) {
            return;
        }

        try {
            await api.delete(`/guests/${id}`);
            toast.success("Guest deleted successfully! 🗑️");
            loadGuests();
        } catch (err) {
            toast.error("Failed to delete guest");
        }
    };

    const cancelEdit = () => {
        setEditingGuest(null);
        setFormData({
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            address: "",
        });
    };

    const filteredGuests = guests.filter(g =>
        g.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.phone.includes(searchTerm)
    );

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-2xl p-6 text-black mb-6"
            >
                <h1 className="text-3xl font-bold mb-6 text-center text-white">
                    {editingGuest ? "Edit Guest" : "Add New Guest"}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white mb-2 font-semibold">First Name *</label>
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                required
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2 font-semibold">Last Name *</label>
                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                required
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2 font-semibold">Phone Number *</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="1234567890"
                                required
                                pattern="[0-9]{10}"
                                title="Please enter 10 digit phone number"
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2 font-semibold">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-white mb-2 font-semibold">Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Main St, City, State"
                            rows="3"
                            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 font-semibold shadow-lg disabled:opacity-50"
                        >
                            {loading ? "Saving..." : editingGuest ? "Update Guest" : "Save Guest"}
                        </button>

                        {editingGuest && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="px-6 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-300 font-semibold"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </motion.div>

            {/* Guest List */}
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white">Guest List ({filteredGuests.length})</h2>

                    <input
                        type="text"
                        placeholder="🔍 Search guests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none w-64"
                    />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {filteredGuests.map((g, index) => (
                            <motion.div
                                key={g.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-lg shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-bold text-lg text-gray-800">
                                            {g.firstName} {g.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500">ID: {g.id}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(g)}
                                            className="text-blue-600 hover:text-blue-800 transition"
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(g.id)}
                                            className="text-red-600 hover:text-red-800 transition"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1 text-sm text-gray-600">
                                    <p>📞 {g.phone}</p>
                                    {g.email && <p>📧 {g.email}</p>}
                                    {g.address && <p>🏠 {g.address}</p>}
                                </div>

                                <button
                                    onClick={() => navigate(`/assign-room/${g.id}`)}
                                    className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition text-sm font-semibold"
                                >
                                    Assign Room
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredGuests.length === 0 && (
                    <div className="text-center py-12 text-white">
                        <p className="text-xl">No guests found</p>
                        <p className="text-sm mt-2">Add your first guest to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}