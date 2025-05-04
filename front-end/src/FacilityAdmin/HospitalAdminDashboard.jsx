import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

const HospitalAdminDashboard = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <LogoutButton />
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Hospital Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4">
        <Link
          to="/facility/register-staff"
          className="bg-blue-600 text-white px-4 py-3 rounded-lg text-center hover:bg-blue-700 transition"
        >
          Register Staff
        </Link>

        <Link
          to="/facility/register-patient"
          className="bg-green-600 text-white px-4 py-3 rounded-lg text-center hover:bg-green-700 transition"
        >
          Register Patient
        </Link>
      </div>

      {/* Optional: display current facility info later */}
      {/* <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold">Facility Info</h2>
        <p>Name: Example Hospital</p>
        <p>Location: Abuja</p>
      </div> */}
    </div>
  );
};

export default HospitalAdminDashboard;
