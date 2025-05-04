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
        setFormData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, navigate, user]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleMedChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedMeds = [...prev.currentMedications];
      if (["amount", "frequency", "instructions"].includes(field)) {
        updatedMeds[index].dosage[field] = value;
      } else {
        updatedMeds[index][field] = field === "refillable" ? value : value;
      }
      return { ...prev, currentMedications: updatedMeds };
    });
  };

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      currentMedications: [
        ...(prev.currentMedications || []),
        {
          name: "",
          prescribedQuantity: 0,
          prescribedBy: user.username || "Doctor",
          dosage: { amount: "", frequency: "", instructions: "" },
          refillable: false,
          refillsLeft: 0,
          dispensed: false,
          dispensedAt: null,
        },
      ],
    }));
  };

  const handleDeleteMedication = (index) => {
    setFormData((prev) => {
      const updatedMeds = [...prev.currentMedications];
      updatedMeds.splice(index, 1);
      return { ...prev, currentMedications: updatedMeds };
    });
  };

  const handleSave = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save");
        return res.json();
      })
      .then(() => {
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

      <div className="bg-white p-6 rounded-xl shadow max-w-4xl space-y-6">
        {/* Basic Patient Info */}
        <div>
          <label className="block font-semibold">Blood Type:</label>
          <input
            type="text"
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="block font-semibold">
            Allergies (comma-separated):
          </label>
          <input
            type="text"
            name="allergies"
            value={formData.allergies?.join(", ") || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                allergies: e.target.value.split(",").map((s) => s.trim()),
              }))
            }
            className="w-full border px-3 py-2 rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="block font-semibold">
            Chronic Conditions (comma-separated):
          </label>
          <input
            type="text"
            name="chronicConditions"
            value={formData.chronicConditions?.join(", ") || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                chronicConditions: e.target.value
                  .split(",")
                  .map((s) => s.trim()),
              }))
            }
            className="w-full border px-3 py-2 rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="block font-semibold">
            Current Infections (comma-separated):
          </label>
          <input
            type="text"
            name="currentInfections"
            value={formData.currentInfections?.join(", ") || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                currentInfections: e.target.value
                  .split(",")
                  .map((s) => s.trim()),
              }))
            }
            className="w-full border px-3 py-2 rounded-lg mt-1"
          />
        </div>

        {/* Medications Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-indigo-600">
            Medications:
          </h3>
          {formData.currentMedications?.map((med, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <input
                type="text"
                placeholder="Medication Name"
                value={med.name}
                onChange={(e) => handleMedChange(index, "name", e.target.value)}
                className="w-full border px-3 py-2 rounded-lg"
              />
              <input
                type="number"
                placeholder="Prescribed Quantity"
                value={med.prescribedQuantity}
                onChange={(e) =>
                  handleMedChange(index, "prescribedQuantity", e.target.value)
                }
                className="w-full border px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Prescribed By"
                value={med.prescribedBy}
                onChange={(e) =>
                  handleMedChange(index, "prescribedBy", e.target.value)
                }
                className="w-full border px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Dosage Amount (e.g., 1 tablet)"
                value={med.dosage.amount}
                onChange={(e) =>
                  handleMedChange(index, "amount", e.target.value)
                }
                className="w-full border px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Dosage Frequency (e.g., twice daily)"
                value={med.dosage.frequency}
                onChange={(e) =>
                  handleMedChange(index, "frequency", e.target.value)
                }
                className="w-full border px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Special Instructions"
                value={med.dosage.instructions}
                onChange={(e) =>
                  handleMedChange(index, "instructions", e.target.value)
                }
                className="w-full border px-3 py-2 rounded-lg"
              />
              <div className="flex items-center gap-2">
                <label>Refillable:</label>
                <input
                  type="checkbox"
                  checked={med.refillable}
                  onChange={(e) =>
                    handleMedChange(index, "refillable", e.target.checked)
                  }
                />
              </div>
              {med.refillable && (
                <input
                  type="number"
                  placeholder="Refills Left"
                  value={med.refillsLeft}
                  onChange={(e) =>
                    handleMedChange(index, "refillsLeft", e.target.value)
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                />
              )}
              <button
                onClick={() => handleDeleteMedication(index)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete Medication
              </button>
            </div>
          ))}
          <button
            onClick={addMedication}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Add Medication
          </button>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Save Changes
          </button>

          <button
            onClick={() => navigate("/provider")}
            className="bg-gray-300 text-white px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Back to Dashboard
          </button>
        </div>

        {saved && (
          <p className="text-green-600 mt-3">Changes saved successfully!</p>
        )}
      </div>
    </div>
  );
}

export default ProviderPatientDetails;
