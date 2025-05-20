import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductLogo from "./ProductLogo";

function QRPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    if (!id) {
      setError("No patient ID found in URL.");
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patients/${id}/public`)
      .then((res) => {
        if (!res.ok) throw new Error("Patient not found");
        return res.json();
      })
      .then((data) => {
        setPatient(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
        setLoading(false);
      });
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-md shadow-md p-6">
      <ProductLogo />
        <h1 className="text-2xl font-bold mb-4 text-black-600">Patient Info</h1>

        {loading && (
          <p className="text-center text-gray-500">Loading patient info...</p>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        {patient && (
          <div>
            <p className="capitalize">
              <strong>Name:</strong> {patient.name}
            </p>
            <p>
              <strong>Patient ID:</strong> {patient.patientId}
            </p>
            {patient.gender && (
              <p className="capitalize">
                <strong>Gender:</strong> {patient.gender}
              </p>
            )}
            {patient.emergencyContact && (
              <p>
                <strong>Emergency Contact:</strong> {patient.emergencyContact}
              </p>
            )}
            {patient.dateOfBirth && (
              <p>
                <strong>Date of Birth:</strong> {patient.dateOfBirth}
              </p>
            )}
            <p>
              <strong>Blood Type:</strong> {patient.bloodType}
            </p>
            <p>
              <strong>Allergies:</strong> {patient.allergies.join(", ")}
            </p>
            <p>
              <strong>Chronic Conditions:</strong>{" "}
              {patient.chronicConditions.join(", ")}
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            className="bg-indigo-600 text-white w-full px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            onClick={() => navigate("/login")}
          >
            Sign in for more details
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRPage;
