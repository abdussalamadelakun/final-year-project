import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const RegisterPatient = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    dateOfBirth: "",
    emergencyContact: "",
    bloodType: "",
    allergies: [""],
    chronicConditions: [""],
    currentInfections: [""],
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      ["allergies", "chronicConditions", "currentInfections"].includes(name)
    ) {
      setFormData({
        ...formData,
        [name]: value.split(",").map((item) => item.trim()),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/patients/register",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(`Patient ${response.data.patient.name} registered!`);
      setFormData({
        name: "",
        gender: "",
        email: "",
        dateOfBirth: "",
        emergencyContact: "",
        bloodType: "",
        allergies: [""],
        chronicConditions: [""],
        currentInfections: [""],
      });
    } catch (err) {
      console.error("Patient registration error:", err);
      setError(
        err?.response?.data?.message || "An error occurred during registration"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Link
        to="/hospital-admin"
        className="inline-block mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ← Back to Dashboard
      </Link>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700 text-center">
          Register New Patient
        </h2>
      </div>

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
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />
<select
  name="gender"
  className="w-full p-2 border rounded"
  value={formData.gender}
  onChange={handleChange}
  required
>
  <option value="">Select Gender</option>
  <option value="male">Male</option>
  <option value="female">Female</option>
  <option value="other">Other</option>
</select>

  

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="emergencyContact"
          placeholder="Emergency Contact"
          className="w-full p-2 border rounded"
          value={formData.emergencyContact}
          onChange={handleChange}
        />

        <input
          type="date"
          name="dateOfBirth"
          className="w-full p-2 border rounded"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />

        <input
          type="text"
          name="bloodType"
          placeholder="Blood Type (e.g. O+)"
          className="w-full p-2 border rounded"
          value={formData.bloodType}
          onChange={handleChange}
        />

        <input
          type="text"
          name="allergies"
          placeholder="Allergies (comma-separated)"
          className="w-full p-2 border rounded"
          value={formData.allergies.join(", ")}
          onChange={handleChange}
        />

        <input
          type="text"
          name="chronicConditions"
          placeholder="Chronic Conditions (comma-separated)"
          className="w-full p-2 border rounded"
          value={formData.chronicConditions.join(", ")}
          onChange={handleChange}
        />

        <input
          type="text"
          name="currentInfections"
          placeholder="Current Infections (comma-separated)"
          className="w-full p-2 border rounded"
          value={formData.currentInfections.join(", ")}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register Patient
        </button>
      </form>
    </div>
  );
};

export default RegisterPatient;
