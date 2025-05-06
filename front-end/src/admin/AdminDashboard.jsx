import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import ProductLogo from "../ProductLogo";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("facilities");

  const [facilities, setFacilities] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [facilitiesError, setFacilitiesError] = useState("");

  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [patientsError, setPatientsError] = useState("");
  const [patientSearchTerm, setPatientSearchTerm] = useState("");

  const filteredUsers = users.filter((user) => {
    const matchesQuery =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === "all" || user.role === selectedRole;

    return matchesQuery && matchesRole;
  });

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsersError("");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setUsersError("Failed to load users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "facilities") {
      fetchFacilities();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "patients") {
      fetchPatients();
    }
  }, [activeTab]);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      console.error(err);
      setPatientsError("Failed to load patients.");
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchFacilities = async () => {
    setLoadingFacilities(true);
    setFacilitiesError("");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/facilities"
      );
      setFacilities(response.data);
    } catch (err) {
      console.error(err);
      setFacilitiesError("Failed to load facilities.");
    } finally {
      setLoadingFacilities(false);
    }
  };

  const handleDeleteFacility = async (id) => {
    if (!window.confirm("Are you sure you want to delete this facility?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/facility/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFacilities((prev) => prev.filter((fac) => fac._id !== id));
    } catch (err) {
      console.error("Failed to delete facility:", err);
      alert("Error deleting facility.");
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/facility/staff/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting patient:", err);
      alert("Failed to delete patient.");
    }
  };

  const filteredPatients = patients.filter((p) => {
    const term = patientSearchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.email && p.email.toLowerCase().includes(term)) ||
      p.patientId.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <ProductLogo />
        
        <LogoutButton />
      </div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {["facilities", "users", "patients"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 font-medium rounded ${
              activeTab === tab
                ? "text-white"
                : "text-gray-600 hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Facilities Section */}
      {activeTab === "facilities" && (
        <div>
          {loadingFacilities && <p>Loading facilities...</p>}
          {facilitiesError && <p className="text-red-600">{facilitiesError}</p>}
          {!loadingFacilities && facilities.length === 0 && (
            <p>No facilities registered yet.</p>
          )}
          {!loadingFacilities && facilities.length > 0 && (
            <table className="w-full table-auto border-none mt-4 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-left">Name</th>
                  <th className="p-2 border text-left">Type</th>
                  <th className="p-2 border text-left">Location</th>
                  <th className="p-2 border text-left">Admin Username</th>
                  <th className="p-2 border text-left">Admin Email</th>
                  <th className="p-2 border text-left" width="85px">Actions</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((fac) => (
                  <tr key={fac._id}>
                    <td className="p-2 border capitalize">{fac.name}</td>
                    <td className="p-2 border capitalize">{fac.type}</td>
                    <td className="p-2 border capitalize">{fac.location}</td>
                    <td className="p-2 border">
                      {fac.adminUser?.username || "N/A"}
                    </td>
                    <td className="p-2 border">
                      {fac.adminUser?.email || "N/A"}
                    </td>
                    <td className="p-1 border">
                      <button
                        onClick={() => handleDeleteFacility(fac._id)}
                        className="text-white -mr-4 w-auto text-center whitespace-nowrap bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Link
            to="/admin/create-facility"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create New Facility
          </Link>
        </div>
      )}

      {activeTab === "users" && (
        <div>
          {loadingUsers && <p>Loading users...</p>}
          {usersError && <p className="text-red-600">{usersError}</p>}
          {!loadingUsers && users.length === 0 && <p>No users found.</p>}
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <input
              type="text"
              placeholder="Search by username or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border rounded w-full md:w-1/3"
            />

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="facilityAdmin">Facility Admin</option>
              <option value="provider">Provider</option>
              <option value="pharmacy">Pharmacy</option>
            </select>
          </div>

          {!loadingUsers && users.length > 0 && (
            <table className="w-full table-auto border mt-4 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-left">Username</th>
                  <th className="p-2 border text-left">Email</th>
                  <th className="p-2 border text-left">Role</th>
                  <th className="p-2 border text-left">Facility</th>
                  <th className="p-2 border text-left" width="95px">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="p-2 border">{user.username}</td>
                    <td className="p-2 border">{user.email}</td>
                    <td className="p-2 border capitalize">{user.role}</td>
                    <td className="p-2 border">
                      {user.facilityId?.name || "—"} (
                      {user.facilityId?.type || "—"})
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleUserDelete(user._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Patients Section */}
      {activeTab === "patients" && (
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-2">Patients</h3>

          {loadingPatients && <p>Loading patients...</p>}
          {patientsError && <p className="text-red-600">{patientsError}</p>}

          {!loadingPatients && patients.length === 0 && (
            <p>No patients found.</p>
          )}
          <input
            type="text"
            placeholder="Search patients by name, email, or ID"
            value={patientSearchTerm}
            onChange={(e) => setPatientSearchTerm(e.target.value)}
            className="mb-3 px-4 py-2 border rounded w-full max-w-md"
          />

          {!loadingPatients && patients.length > 0 && (
            <table className="w-full table-auto border mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-left">Name</th>
                  <th className="p-2 border text-left">Email</th>
                  <th className="p-2 border text-left">DOB</th>
                  <th className="p-2 border text-left">Emergency Contact</th>
                  <th className="p-2 border text-left">Patient ID</th>
                  <th className="p-2 border text-left" width="95px">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((p) => (
                  <tr key={p._id}>
                    <td className="p-2 border">{p.name}</td>
                    <td className="p-2 border">{p.email || "—"}</td>
                    <td className="p-2 border">
                      {p.dateOfBirth
                        ? new Date(p.dateOfBirth).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-2 border">{p.emergencyContact || "—"}</td>
                    <td className="p-2 border">{p.patientId}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleDeletePatient(p._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 -mr-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
