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

  const [editData, setEditData] = useState(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not logged in. Please sign in.");
      return;
    }

    fetch("/api/rooms", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then(setRooms)
      .catch(() => toast.error("Failed to fetch rooms"));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const newRoom = await res.json();
      setRooms((prev) => [...prev, newRoom]);
      toast.success("Room added successfully!");
      setFormData({
        roomNumber: "",
        roomType: "",
        pricePerNight: "",
        roomStatus: "Available",
      });
    } else {
      const errText = await res.text();
      toast.error("Failed: " + errText);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not logged in. Please sign in.");
      return;
    }

    const res = await fetch(`/api/rooms/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setRooms((prev) => prev.filter((r) => r.roomId !== id));
      toast.success("Room deleted 🗑️");
    } else {
      toast.error("Failed to delete room");
    }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not logged in. Please sign in.");
      return;
    }

    const res = await fetch(`/api/rooms/${editData.roomId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editData),
    });

    if (res.ok) {
      toast.success("Room updated ✅");
      setEditData(null);
      loadRooms();
    } else {
      toast.error("Failed to update room");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Room Management</h2>

      {/* Add Room Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-white p-4 shadow rounded mb-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="roomNumber"
            placeholder="Room Number"
            value={formData.roomNumber}
            onChange={handleChange}
            className="border p-2 w-full rounded text-black"
            required
          />

          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            className="border p-2 w-full rounded text-black"
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
            className="border p-2 w-full rounded text-black"
            required
          />

          <select
            name="roomStatus"
            value={formData.roomStatus}
            onChange={handleChange}
            className="border p-2 w-full rounded text-black"
          >
            <option>Available</option>
            <option>Booked</option>
            <option>Maintenance</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Add Room
        </button>
      </form>

      {/* Table for Room List */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3 border">Room Number</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Price / Night</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.roomId} className="hover:bg-gray-50">
                <td className="p-3 border">{r.roomNumber}</td>
                <td className="p-3 border">{r.roomType}</td>
                <td className="p-3 border">${r.pricePerNight}</td>
                <td className="p-3 border">{r.roomStatus}</td>
                <td className="p-3 border space-x-2">
                  <button
                    onClick={() => setEditData(r)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.roomId)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No rooms available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-lg font-bold mb-3">Edit Room</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                type="text"
                name="roomNumber"
                value={editData.roomNumber}
                onChange={handleEditChange}
                className="border p-2 w-full rounded text-black"
                required
              />

              <select
                name="roomType"
                value={editData.roomType}
                onChange={handleEditChange}
                className="border p-2 w-full rounded text-black"
                required
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
              </select>

              <input
                type="number"
                name="pricePerNight"
                value={editData.pricePerNight}
                onChange={handleEditChange}
                className="border p-2 w-full rounded text-black"
                required
              />

              <select
                name="roomStatus"
                value={editData.roomStatus}
                onChange={handleEditChange}
                className="border p-2 w-full rounded text-black"
              >
                <option>Available</option>
                <option>Booked</option>
                <option>Maintenance</option>
              </select>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setEditData(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
