import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function RoomsUI() {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "",
    pricePerNight: "",
    roomStatus: "Available",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not logged in. Please sign in.");
      return;
    }

    fetch("/api/rooms", {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then(setRooms)
      .catch(() => toast.error("Failed to fetch rooms"));
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Not logged in. Please sign in first.");
      return;
    }

    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const newRoom = await res.json(); // backend must return created room
      setRooms(prev => [...prev, newRoom]);
      toast.success("Room added successfully!");
      setFormData({
        roomNumber: "",
        roomType: "",
        pricePerNight: "",
        roomStatus: "Available",
      });
    } else {
      if (res.status === 401 || res.status === 403) {
        toast.error("Unauthorized. Please login again.");
      } else {
        const errText = await res.text();
        toast.error("Failed: " + errText);
      }
    }
  };

  const handleDelete = async id => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not logged in. Please sign in.");
      return;
    }

    const res = await fetch(`/api/rooms/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setRooms(prev => prev.filter(r => r.roomId !== id));
      toast.success("Room deleted 🗑️");
    } else {
      toast.error("Failed to delete room");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Room Management</h2>

      {/* Add Room Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-white p-4 shadow rounded"
      >
        <input
          type="text"
          name="roomNumber"
          placeholder="Room Number"
          value={formData.roomNumber}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <select
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Select Type</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Suite">Suite</option>
        </select>

        <input
          type="number"
          name="pricePerNight"
          placeholder="Price Per Night"
          value={formData.pricePerNight}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <select
          name="roomStatus"
          value={formData.roomStatus}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          <option>Available</option>
          <option>Booked</option>
          <option>Maintenance</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Add Room
        </button>
      </form>

      {/* Room List */}
      <div className="mt-6 space-y-2">
        {rooms.map(r => (
          <div
            key={r.roomId}
            className="p-3 bg-gray-100 flex justify-between items-center rounded"
          >
            <div>
              <p>
                <strong>{r.roomNumber}</strong> ({r.roomType})
              </p>
              <p>${r.pricePerNight}/night - {r.roomStatus}</p>
            </div>
            <button
              onClick={() => handleDelete(r.roomId)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
