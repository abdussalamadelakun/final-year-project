import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CreateFacility = () => {
  const [form, setForm] = useState({
    facilityName: "",
    facilityType: "hospital",
    location: "",
    adminUsername: "",
    adminEmail: "",
    adminPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await axios.post("http://localhost:5000/api/admin/facilities/register", {
        name: form.facilityName,
        type: form.facilityType,
        location: form.location,
        admin: {
          username: form.adminUsername,
          email: form.adminEmail,
          password: form.adminPassword,
        },
      });

      setSuccessMessage("Facility and admin created successfully.");
      setForm({
        facilityName: "",
        facilityType: "hospital",
        location: "",
        adminUsername: "",
        adminEmail: "",
        adminPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while creating facility."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <Link
        to="/admin/dashboard"
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ← Back to Dashboard
      </Link>
      <h2 className="text-2xl font-bold mb-4">Create New Facility</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Facility Name</label>
          <input
            type="text"
            name="facilityName"
            value={form.facilityName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Facility Type</label>
          <select
            name="facilityType"
            value={form.facilityType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="hospital">Hospital</option>
            <option value="pharmacy">Pharmacy</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <hr className="my-4" />

        <div>
          <label className="block font-medium">Admin Username</label>
          <input
            type="text"
            name="adminUsername"
            value={form.adminUsername}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Admin Email</label>
          <input
            type="email"
            name="adminEmail"
            value={form.adminEmail}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Admin Password</label>
          <input
            type="password"
            name="adminPassword"
            value={form.adminPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {successMessage && <p className="text-green-600">{successMessage}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Facility"}
        </button>
      </form>
      
    </div>
  );
};

export default CreateFacility;
