import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";

export default function Guest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    idProofType: "",
    idProofNumber: "",
    address: "",
  });

  const [guests, setGuests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    api.get("/guests")
      .then((res) => setGuests(res.data))
      .catch((err) => {
        console.error("Load guests failed", err);
        if (err.response?.status === 403) {
          alert("Unauthorized, please login again");
          navigate("/login");
        }
      });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/guests", formData);
      const saved = res.data;

      alert("Guest saved successfully");
      setGuests((prev) => [...prev, saved]);

      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        idProofType: "",
        idProofNumber: "",
        address: "",
      });

      navigate(`/assign-room/${saved.id}`);
    } catch (err) {
      console.error("Guest save failed:", err.response || err);
      alert("Save failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-xl text-black">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Guest Registration</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
          className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
          className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email (optional)"
          className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="idProofType"
          value={formData.idProofType}
          onChange={handleChange}
          required
          className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select ID Proof</option>
          <option>Passport</option>
          <option>License</option>
          <option>National ID</option>
        </select>
        <input
          name="idProofNumber"
          value={formData.idProofNumber}
          onChange={handleChange}
          placeholder="ID Proof Number"
          className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="p-3 rounded border col-span-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="col-span-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-300 font-semibold shadow"
        >
          Save Guest
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4 text-white">Saved Guests</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {guests.map((g, index) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <p className="font-bold text-lg">{g.firstName} {g.lastName}</p>
            <p>📞 {g.phone}</p>
            <p>🪪 {g.idProofType}: {g.idProofNumber}</p>
            {g.email && <p>📧 {g.email}</p>}
            <p>🏠 {g.address}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
