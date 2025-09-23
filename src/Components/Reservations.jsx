import { useEffect, useState } from "react";
import api from "../api/axios"; // ✅ axios instance with JWT support

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const res = await api.get("/reservations"); // ✅ JWT automatically added
        setReservations(res.data);
      } catch (err) {
        console.error("Failed to load reservations", err);
        setError("Failed to load reservations. Please login again.");
      }
    };

    loadReservations();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reservations</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2 text-left">Guest</th>
              <th className="border px-4 py-2 text-left">Room</th>
              <th className="border px-4 py-2 text-left">Check-In</th>
              <th className="border px-4 py-2 text-left">Check-Out</th>
              <th className="border px-4 py-2 text-left">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length > 0 ? (
              reservations.map((r) => (
                <tr key={r.reservationId} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {r.guest?.firstName} {r.guest?.lastName}
                  </td>
                  <td className="border px-4 py-2">
                    {r.room?.roomNumber} ({r.room?.roomType})
                  </td>
                  <td className="border px-4 py-2">{r.checkInDate}</td>
                  <td className="border px-4 py-2">{r.checkoutDate}</td>
                  <td className="border px-4 py-2">{r.totalAmount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-500 border"
                >
                  No reservations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reservations;
