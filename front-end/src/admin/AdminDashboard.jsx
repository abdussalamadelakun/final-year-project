import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";

const AdminDashboard = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/facilities"
        );
        setFacilities(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load facilities.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
        <LogoutButton />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <Link
          to="/admin/create-facility"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Facility
        </Link>
      </div>

      {loading && <p>Loading facilities...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && facilities.length === 0 && (
        <p>No facilities registered yet.</p>
      )}

      {!loading && facilities.length > 0 && (
        <table className="w-full table-auto border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Admin Username</th>
              <th className="p-2 border">Admin Email</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((fac) => (
              <tr key={fac._id}>
                <td className="p-2 border">{fac.name}</td>
                <td className="p-2 border capitalize">{fac.type}</td>
                <td className="p-2 border">{fac.location}</td>
                <td className="p-2 border">
                  {fac.adminUser?.username || "N/A"}
                </td>
                <td className="p-2 border">{fac.adminUser?.email || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
