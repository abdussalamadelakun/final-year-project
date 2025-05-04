import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const RegisterStaff = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "provider", // or "pharmacy"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [facilityType, setFacilityType] = useState(null);

  useEffect(() => {
    const fetchFacilityType = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/facility/${user.facilityId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFacilityType(res.data.facility.type);
      } catch (err) {
        console.error("Error fetching facility:", err);
      }
    };

    if (user?.facilityId) {
      fetchFacilityType();
    }
  }, [user, token]);

  const dashboardPath =
    facilityType === "hospital"
      ? "/hospital-admin"
      : "/facility/pharmacy-dashboard";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/facility/staff/register",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Staff registered successfully!");
      setFormData({ username: "", email: "", password: "", role: "provider" });

      // Optionally redirect after success:
      // setTimeout(() => navigate("/hospital-admin"), 1500);
    } catch (err) {
      console.error("Error registering staff:", err.response || err.message);
      setError(err?.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {facilityType && (
        <Link
          to={dashboardPath}
          className="inline-block mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ← Back to Dashboard
        </Link>
      )}

      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
        Register New Staff
      </h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="Username"
          className="w-full p-2 border rounded"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="provider">Healthcare Provider</option>
          <option value="pharmacy">Pharmacist</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register Staff
        </button>
      </form>
    </div>
  );
};

export default RegisterStaff;
