import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AssignRoom() {
    const { guestId } = useParams();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [formData, setFormData] = useState({
        roomId: "",
        checkInDate: "",
        checkoutDate: ""
    });

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("/api/rooms", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then(setRooms)
            .catch(() => toast.error("Failed to fetch rooms"));
    }, []);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const res = await fetch("/api/reservations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                guest: { id: parseInt(guestId) },
                room: { roomId: parseInt(formData.roomId) },
                checkInDate: formData.checkInDate,
                checkoutDate: formData.checkoutDate
            })
        });

        if (res.ok) {
            toast.success("Room assigned successfully!");
            navigate("/reservations");
        } else {
            toast.error("Failed to assign room");
        }
    };


    return (
        <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto bg-white shadow rounded space-y-3">
            <h2 className="text-xl font-bold">Assign Room</h2>

            <select name="roomId" value={formData.roomId} onChange={handleChange}
                className="border p-2 w-full rounded" required>
                <option value="">Select Room</option>
                {rooms.map(r => (
                    <option key={r.roomId} value={r.roomId}>
                        {r.roomNumber} - {r.roomType} {r.roomStatus}
                    </option>
                ))}
            </select>

            <input type="date" name="checkInDate" value={formData.checkInDate}
                onChange={handleChange} className="border p-2 w-full rounded" required />

            <input type="date" name="checkoutDate" value={formData.checkoutDate}
                onChange={handleChange} className="border p-2 w-full rounded" required />

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                Confirm Reservation
            </button>
        </form>
    );
}
