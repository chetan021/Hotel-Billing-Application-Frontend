import {useEffect, useState} from "react";
import userService from "../services/userService.js";
import {toast} from "react-hot-toast";

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "" });

    const userData = localStorage.getItem("user");

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const data = await userService.getUserById(userData?.id);
            setUser(data);
            setFormData({ name: data.name, email: data.email });
        } catch (err) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim()) {
            toast.error("All fields are required");
            return;
        }

        try {
            await userService.updateUser(userData.id, formData);
            toast.success("Profile updated!");

            const updatedUser = { ...user, ...formData };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setEditing(false);
        } catch (err) {
            toast.error(err?.message || "Failed to update profile");
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;
    if (!user) return <div className="text-white">User not found</div>;

    return (
        <div className="max-w-md mx-auto bg-white bg-opacity-10 p-6 rounded border border-white border-opacity-20">
            <h2 className="text-2xl font-bold text-white mb-6">My Profile</h2>

            {!editing ? (
                <div className="space-y-4">
                    <div>
                        <label className="text-gray-300 text-sm">Name</label>
                        <p className="text-white text-lg font-semibold">{user.name}</p>
                    </div>
                    <div>
                        <label className="text-gray-300 text-sm">Email</label>
                        <p className="text-white text-lg font-semibold">{user.email}</p>
                    </div>
                    <div>
                        <label className="text-gray-300 text-sm">Role</label>
                        <p className="text-white text-lg font-semibold">{user.role}</p>
                    </div>
                    <button
                        onClick={() => setEditing(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold text-white transition mt-4"
                    >
                        Edit Profile
                    </button>
                </div>
            ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
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
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold text-white transition"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditing(false)}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-semibold text-white transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
