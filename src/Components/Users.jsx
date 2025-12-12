// ✅ CORRECT - With all states and error handling
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import userService from "../services/userService";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "GUEST",
        isActive: true,
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userService.getAllUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            const errorMsg = err?.message || "Failed to fetch users";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("All fields are required");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error("Invalid email format");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            if (editingId) {
                await userService.updateUser(editingId, formData);
                toast.success("User updated successfully!");
            } else {
                await userService.createUser(formData);
                toast.success("User created successfully!");
            }

            setFormData({ name: "", email: "", password: "", role: "GUEST", isActive: true });
            setEditingId(null);
            setShowForm(false);
            fetchUsers();
        } catch (err) {
            toast.error(err?.message || "Failed to save user");
        }
    };

    const handleEditUser = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role || "GUEST",
            isActive: user.isActive !== false,
        });
        setEditingId(user.id);
        setShowForm(true);
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await userService.deleteUser(id);
                toast.success("User deleted successfully!");
                fetchUsers();
            } catch (err) {
                toast.error(err?.message || "Failed to delete user");
            }
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await userService.toggleUserStatus(id, !currentStatus);
            toast.success("User status updated!");
            fetchUsers();
        } catch (err) {
            toast.error(err?.message || "Failed to update user status");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white text-lg">Loading users...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 p-4 rounded mb-6">
                <p className="text-red-300">{error}</p>
                <button
                    onClick={fetchUsers}
                    className="mt-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">User Management</h2>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ name: "", email: "", password: "", role: "GUEST", isActive: true });
                        setShowForm(!showForm);
                    }}
                    className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold text-white"
                >
                    {showForm ? "Cancel" : "Add User"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleAddUser} className="bg-white bg-opacity-10 p-6 rounded mb-6 space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">
                        {editingId ? "Edit User" : "Create New User"}
                    </h3>

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-white text-black"
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-white text-black"
                        required
                    />

                    {!editingId && (
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 rounded bg-white text-black"
                            required
                        />
                    )}

                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-white text-black"
                    >
                        <option value="ADMIN">Admin</option>
                        <option value="STAFF">Staff</option>
                        <option value="GUEST">Guest</option>
                    </select>

                    <label className="flex items-center space-x-2 text-white">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4"
                        />
                        <span>Active</span>
                    </label>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold text-white"
                    >
                        {editingId ? "Update User" : "Create User"}
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.id} className="bg-white bg-opacity-10 p-4 rounded">
                            <h3 className="font-bold text-lg text-white">{user.name}</h3>
                            <p className="text-sm text-gray-300">Email: {user.email}</p>
                            <p className="text-sm text-gray-300">Role: {user.role || "N/A"}</p>
                            <p className={`text-sm font-semibold mt-2 ${user.isActive ? "text-green-300" : "text-red-300"}`}>
                                {user.isActive ? "Active" : "Inactive"}
                            </p>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleEditUser(user)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm text-white"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleToggleStatus(user.id, user.isActive)}
                                    className={`flex-1 px-3 py-2 rounded text-sm text-white ${
                                        user.isActive ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
                                    }`}
                                >
                                    {user.isActive ? "Deactivate" : "Activate"}
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm text-white"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-300 col-span-full">No users found</p>
                )}
            </div>
        </div>
    );
}
