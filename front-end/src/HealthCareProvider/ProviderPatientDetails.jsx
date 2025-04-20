import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProviderPatientDetails() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "provider") {
      navigate("/login");
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patients/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Patient not found");
        return res.json();
      })
      .then((data) => {
        // Flatten arrays for editing
        setFormData({
          ...data,
          allergies: data.allergies.join(", "),
          chronicConditions: data.chronicConditions.join(", "),
          currentInfections: data.currentInfections.join(", "),
          currentMedications: data.currentMedications.join(", "),
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, navigate, user]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    const updated = {
      ...formData,
      allergies: formData.allergies.split(",").map((s) => s.trim()),
      chronicConditions: formData.chronicConditions
        .split(",")
        .map((s) => s.trim()),
      currentInfections: formData.currentInfections
        .split(",")
        .map((s) => s.trim()),
      currentMedications: formData.currentMedications
        .split(",")
        .map((s) => s.trim()),
    };

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save");
        return res.json();
      })
      .then((updatedPatient) => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      })
      .catch((err) => alert(err.message));
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        Edit Patient: {formData.name}
      </h2>

      <div className="bg-white p-6 rounded-xl shadow max-w-2xl space-y-4">
        {[
          "bloodType",
          "allergies",
          "chronicConditions",
          "currentInfections",
          "currentMedications",
        ].map((field) => (
          <div key={field}>
            <label className="block font-semibold capitalize">
              {field.replace(/([A-Z])/g, " $1")}:
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg mt-1"
            />
          </div>
        ))}

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Save Changes
          </button>

          <button
            onClick={() => navigate("/provider")}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Back to Dashboard
          </button>
        </div>

        {saved && <p className="text-green-600 mt-3">Changes saved!</p>}
      </div>
    </div>
  );
}

export default ProviderPatientDetails;
