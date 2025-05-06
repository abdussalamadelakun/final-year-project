import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LogoutButton from "../components/LogoutButton";
import axios from "axios";

function ProviderDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [facility, setFacility] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "provider") {
      navigate("/login");
      return;
    }

    const fetchFacility = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/facility/${user.facilityId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setFacility(res.data.facility); // backend returns { facility: { ... } }
      } catch (err) {
        console.error("Failed to load facility:", err);
      }
    };

    fetchFacility();
  }, [user, navigate]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <div className="flex justify-end mb-4">
          <LogoutButton />
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">
            Welcome, {user?.username}
          </h1>
        </div>
        {facility && (
          <div className="bg-white p-4 rounded shadow mb-6 ">
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">
              Facility Details
            </h2>
            <p className="capitalize">
              <strong>Name:</strong> {facility.name}
            </p>
            <p className="capitalize">
              <strong>Type:</strong> {facility.type}
            </p>
            {facility.location && (
              <p className="capitalize">
                <strong>Location:</strong> {facility.location}
              </p>
            )}
          </div>
        )}

        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Search
            </button>
          </div>
        </div>

        {loading && <p className="text-gray-500">Searching...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {patients.length === 0 && !loading && (
          <p className="text-gray-500 mt-4">
            No patients found. Try a different search.
          </p>
        )}

        <div className="space-y-4">
          {patients.map((p) => (
            <div
              key={p._id}
              className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-100 transition"
              onClick={() => navigate(`/provider/patient/${p.patientId}`)}
            >
              <p>
                <strong>Name:</strong> {p.name}
              </p>
              {p.email && (
                <p>
                  <strong>Email:</strong> {p.email}
                </p>
              )}
              {p.emergencyContact && (
                <p>
                  <strong>Emergency Contact:</strong> {p.emergencyContact}
                </p>
              )}
              {p && p.dateOfBirth && (
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(p.dateOfBirth).toISOString().split("T")[0]}
                </p>
              )}
              <p>
                <strong>ID:</strong> {p.patientId}
              </p>
              <p>
                <strong>Conditions:</strong>{" "}
                {p.chronicConditions.length > 0
                  ? p.chronicConditions.join(", ")
                  : "None"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;
