import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";
import ProductLogo from "./ProductLogo";

function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      const { user, token } = response.data;

      login({ ...user, token }); // Save token and user to context

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "facilityAdmin") {
        // Fetch facility type to determine hospital or pharmacy
        const facilityRes = await axios.get(
          `http://localhost:5000/api/facility/${user.facilityId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const facilityType = facilityRes.data.facility?.type;
        console.log("Facility type:", facilityType);

        if (facilityType === "hospital") {
          navigate("/hospital-admin");
        } else if (facilityType === "pharmacy") {
          navigate("/facility/pharmacy-dashboard");
        } else {
          setError("Unknown facility type");
        }
      } else if (user.role === "provider") {
        navigate("/provider");
      } else if (user.role === "pharmacy") {
        navigate("/pharmacy");
      } else {
        setError("Unsupported user role");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials or server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
        <div className="flex justify-center">
          <ProductLogo />
        </div>

        <h2 className="text-xl font-bold mb-4 text-center text-black-600">
          Sign In
        </h2>
        {error && (
          <p className="text-red-500 mb-2 text-sm text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
