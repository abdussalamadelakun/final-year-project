import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import LogoutButton from "./components/LogoutButton";
import axios from "axios";

function PharmacyDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || user.role !== "pharmacy") {
      navigate("/login");
      return;
    }

    if (user.facilityId) {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/api/facility/${user.facilityId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => setFacility(res.data.facility))
        .catch((err) => console.error("Failed to load facility", err));
    }
  }, [user, navigate, token]);

  const handleSearch = () => {
    if (!searchTerm) return;

    setLoading(true);
    setError("");

    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/patients?search=${searchTerm}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
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

  const handleDispense = (patientId, medName) => {
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/patients/${patientId}/medications/${medName}/dispense`,
      {
        method: "PUT",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to dispense medication");
        return res.json();
      })
      .then((data) => {
        setPatients((prev) =>
          prev.map((p) =>
            p.patientId === patientId
              ? {
                  ...p,
                  currentMedications: p.currentMedications.map((med) =>
                    med.name === medName ? data.medication : med
                  ),
                }
              : p
          )
        );
      })
      .catch((err) => alert(err.message));
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
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">
              Facility Details
            </h2>
            <p className="capitalize"><strong>Name:</strong> {facility.name}</p>
            <p className="capitalize"><strong>Type:</strong> {facility.type}</p>
            <p className="capitalize"><strong>Location:</strong> {facility.location}</p>
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

        <div className="space-y-6">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h2 className="text-xl font-bold text-indigo-600 mb-2">
                {patient.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Patient ID:</strong> {patient.patientId}
              </p>

              <div className="space-y-4">
                {patient.currentMedications.map((med, index) => (
                  <div key={index} className="border-b pb-4">
                    <p><strong>Medication:</strong> {med.name}</p>
                    <p><strong>Prescribed Quantity:</strong> {med.prescribedQuantity}</p>
                    <p><strong>Prescribed By:</strong> {med.prescribedBy}</p>
                    <p><strong>Dosage:</strong> {`${med.dosage.amount}, ${med.dosage.frequency}, ${med.dosage.instructions}`}</p>
                    <p><strong>Refills Left:</strong> {med.refillsLeft}</p>
                    <p><strong>Status:</strong> {med.dispensed ? (
                      <span className="text-green-600">
                        Dispensed {med.dispensedAt ? `at ${new Date(med.dispensedAt).toLocaleString()}` : ""}
                      </span>
                    ) : (
                      <span className="text-red-500">Not Dispensed</span>
                    )}</p>

                    {med.refillsLeft > 0 && (
                      <button
                        onClick={() => handleDispense(patient.patientId, med.name)}
                        className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Dispense
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PharmacyDashboard;
