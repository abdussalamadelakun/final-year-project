import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LogoutButton from "../components/LogoutButton";

function ProviderDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "provider") {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSearch = () => {
    if (!searchTerm) return;

    setLoading(true);
    setError("");

    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/patients?search=${searchTerm}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch patients");
        return res.json();
      })
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-indigo-700">
          Welcome, Dr. {user?.username}
        </h1>
        <LogoutButton />
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md w-full max-w-md"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-500">Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {patients.map((p) => (
        <div
          key={p._id}
          className="bg-white p-4 rounded shadow max-w-xl mb-4 cursor-pointer hover:bg-gray-100"
          onClick={() => navigate(`/provider/patient/${p.patientId}`)}
        >
          <p>
            <strong>Name:</strong> {p.name}
          </p>
          <p>
            <strong>ID:</strong> {p.patientId}
          </p>
          <p>
            <strong>Conditions:</strong> {p.chronicConditions.join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ProviderDashboard;
