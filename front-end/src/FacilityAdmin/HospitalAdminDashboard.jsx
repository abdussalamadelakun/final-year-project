import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import ProductLogo from "../ProductLogo";

const HospitalAdminDashboard = () => {
  const [facility, setFacility] = useState(null);
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardInfo = async () => {
      try {
        const userInfo = JSON.parse(atob(token.split(".")[1]));
        const facilityId = userInfo.facilityId;

        const facilityRes = await axios.get(
          `http://localhost:5000/api/facility/${facilityId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFacility(facilityRes.data.facility);

        const staffRes = await axios.get(
          `http://localhost:5000/api/facility/staff/by-facility/${facilityId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStaff(staffRes.data.staff);
      } catch (err) {
        console.error("Error fetching hospital admin dashboard:", err);
        setError("Failed to load dashboard info.");
      }
    };

    fetchDashboardInfo();
  }, [token]);

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/facility/staff/${staffId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStaff((prev) => prev.filter((s) => s._id !== staffId));
    } catch (err) {
      console.error("Error deleting staff:", err);
      alert(err.response?.data?.message || "Failed to delete staff.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <ProductLogo />
        <LogoutButton />
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Hospital Admin Dashboard
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {facility && (
        <div className="bg-gray-100 p-4 rounded mb-6 shadow">
          <h3 className="text-xl font-semibold">Facility Information</h3>
          <p className="capitalize">
            <strong>Name:</strong> {facility.name}
          </p>
          <p className="capitalize">
            <strong>Type:</strong> {facility.type}
          </p>
          <p className="capitalize">
            <strong>Location:</strong> {facility.location}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 mb-6">
        <Link
          to="/facility/register-patient"
          className="bg-blue-600 text-white px-4 py-3 rounded-lg text-center hover:bg-blue-700 transition"
        >
          Register Patient
        </Link>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">Current Staff</h3>
          <Link
            to="/facility/register-staff"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Register Staff
          </Link>
        </div>
        {staff.length === 0 ? (
          <p>No staff registered yet.</p>
        ) : (
          <ul className="space-y-2">
            {staff.map((user) => (
              <li
                key={user._id}
                className="p-2 bg-white rounded shadow border flex justify-between items-center"
              >
                <div>
                  <div>{user.username}</div>
                  <div className="text-gray-500 text-sm">{user.email}</div>
                </div>
                <button
                  onClick={() => handleDeleteStaff(user._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HospitalAdminDashboard;
