import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import LogoutButton from "./components/LogoutButton";

function PharmacyDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "pharmacy") {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSearch = () => {
    if (!searchTerm) return;

    setLoading(true);
    setError("");

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patients?search=${searchTerm}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const markAsDispensed = (id) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patients/${id}/dispense`, {
      method: "PUT",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update");
        return res.json();
      })
      .then((updated) => {
        // update local state
        setResults((prev) =>
          prev.map((p) => (p.patientId === updated.patientId ? updated : p))
        );
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-indigo-700">
          Welcome, {user?.username} (Pharmacy)
        </h1>
        <LogoutButton />
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-md w-full max-w-md"
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

      <div className="space-y-4">
        {results.map((p) => (
          <div
            key={p._id}
            className="bg-white p-4 rounded shadow max-w-xl"
          >
            <p><strong>Name:</strong> {p.name}</p>
            <p><strong>ID:</strong> {p.patientId}</p>
            <p><strong>Medications:</strong> {p.currentMedications.join(", ")}</p>
            <p>
              <strong>Status:</strong>{" "}
              {p.dispensed ? (
                <span className="text-green-600">Dispensed</span>
              ) : (
                <span className="text-red-500">Not dispensed</span>
              )}
            </p>
            {!p.dispensed && (
              <button
                onClick={() => markAsDispensed(p.patientId)}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Mark as Dispensed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PharmacyDashboard;
