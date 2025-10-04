import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios"; // ✅ import axios instance with JWT & baseURL

export default function InvoiceUI() {
  const [invoices, setInvoices] = useState([]);
  const [formData, setFormData] = useState({
    reservationId: "",
    roomCharges: "",
    extraCharges: "",
    tax: "",
  });

  // ✅ Fetch invoices (with JWT)
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const res = await api.get("/invoices"); // baseURL handles /api
        setInvoices(res.data);
      } catch (err) {
        console.error("Error fetching invoices", err);
        toast.error("Failed to fetch invoices. Check login or permissions.");
      }
    };
    loadInvoices();
  }, []);

  // ✅ Update input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Create invoice
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const total =
        parseFloat(formData.roomCharges || 0) +
        parseFloat(formData.extraCharges || 0) +
        parseFloat(formData.tax || 0);

      const newInvoice = {
        reservation: { reservationId: parseInt(formData.reservationId) },
        roomCharges: parseFloat(formData.roomCharges),
        extraCharges: parseFloat(formData.extraCharges),
        tax: parseFloat(formData.tax),
        totalAmount: total,
      };

      await api.post("/invoices", newInvoice);
      toast.success("Invoice created successfully!");
      setFormData({
        reservationId: "",
        roomCharges: "",
        extraCharges: "",
        tax: "",
      });

      // Reload updated invoices
      const res = await api.get("/invoices");
      setInvoices(res.data);
    } catch (err) {
      console.error("Error creating invoice", err);
      if (err.response?.status === 403) {
        toast.error("Access forbidden. Please login as Admin or authorized user.");
      } else {
        toast.error("Failed to create invoice.");
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Invoice Management</h2>

      {/* Invoice Form */}
      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 shadow rounded">
        <input
          type="number"
          name="reservationId"
          placeholder="Reservation ID"
          value={formData.reservationId}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="number"
          name="roomCharges"
          placeholder="Room Charges"
          value={formData.roomCharges}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="number"
          name="extraCharges"
          placeholder="Extra Charges"
          value={formData.extraCharges}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          type="number"
          name="tax"
          placeholder="Tax"
          value={formData.tax}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Create Invoice
        </button>
      </form>

      {/* Invoice Table */}
      <table className="mt-6 w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Invoice ID</th>
            <th className="border px-3 py-2">Reservation</th>
            <th className="border px-3 py-2">Total</th>
            <th className="border px-3 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.invoiceId}>
              <td className="border px-3 py-2">{inv.invoiceId}</td>
              <td className="border px-3 py-2">{inv.reservation?.reservationId}</td>
              <td className="border px-3 py-2">${inv.totalAmount}</td>
              <td className="border px-3 py-2">{inv.invoiceDate || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
