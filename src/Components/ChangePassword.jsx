// Create src/Components/ChangePassword.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import userService from "../services/userService";

export default function ChangePassword() {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleChangePassword = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.oldPassword || !formData.newPassword) {
            toast.error("All fields are required");
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        try {
            setLoading(true);
            await userService.changePassword(user.id, formData.oldPassword, formData.newPassword);
            toast.success("Password changed successfully!");
            setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            toast.error(err?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white bg-opacity-10 p-6 rounded">
            <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
                <input
                    type="password"
                    placeholder="Current Password"
                    value={formData.oldPassword}
                    onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                    className="w-full px-4 py-2 rounded bg-white text-black"
                    required
                />

                <input
                    type="password"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 rounded bg-white text-black"
                    required
                />

                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 rounded bg-white text-black"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded font-semibold text-white"
                >
                    {loading ? "Changing..." : "Change Password"}
                </button>
            </form>
        </div>
    );
}
