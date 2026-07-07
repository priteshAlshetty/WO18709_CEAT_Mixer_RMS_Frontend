import React, { useState, useEffect } from 'react'
import axiosInstance from '../api/axios'
import './UserManagementPage.css'
import api from "../api/axios";

const UserManagementPage = () => {
  const [activeTab, setActiveTab] = useState("view");
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authLevel, setAuthLevel] = useState('operator')

  const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState("");


const fetchUsers = async () => {
  try {
    const res = await api.get("/auth/getAllUsers");

    console.log("API Response:", res.data);

    setUsers(res.data);
  } catch (err) {
    console.error(err);
    alert("Unable to fetch users");
  }
};

useEffect(() => {
  if (activeTab === "view" || activeTab === "delete") {
    fetchUsers();
  }
}, [activeTab]);

const handleDeleteUser = async () => {
  if (!selectedUser) {
    alert("Select a user");
    return;
  }

  if (!window.confirm("Delete this user?")) return;

  try {
   const res = await api.delete("/auth/deleteUser", {
    data: {
        username: selectedUser
    }
});

    alert(res.data.message);

    fetchUsers();
    setSelectedUser("");
  } catch (err) {
    alert(
      err.response?.data?.message ||
      "Delete failed"
    );
  }
};

  const handleCreateUser = async () => {
    try {
      const response = await api.post('/auth/signup', {
        username,
        password,
        auth_level: authLevel
      })

      if (response.data.success) {
        alert(response.data.message)

        setUsername('')
        setPassword('')
        setAuthLevel('operator')
      } else {
        alert(response.data.error)
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to create user'
      )
    }
  }

return (
  <div className="um-page">

    {/* Tabs */}
    <div className="um-tabs">
      <button
        className={activeTab === "view" ? "active" : ""}
        onClick={() => setActiveTab("view")}
      >
        View Users
      </button>

      <button
        className={activeTab === "add" ? "active" : ""}
        onClick={() => setActiveTab("add")}
      >
        Add User
      </button>

      <button
        className={activeTab === "delete" ? "active" : ""}
        onClick={() => setActiveTab("delete")}
      >
        Delete User
      </button>
    </div>

    <div className="um-card">

      {/* ================= VIEW USERS ================= */}
      {activeTab === "view" && (
        <>
          <h2>View Users</h2>

          <table className="um-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                <tr key={user.user_no}>
  <td>{user.user_name}</td>
  <td>{user.auth_level}</td>
</tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No Users Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {/* ================= ADD USER ================= */}
      {activeTab === "add" && (
        <>
          <h2>Create User</h2>

          <div className="um-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="um-field">
            <label>Password</label>
            <input
              type="text"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="um-field">
            <label>Role</label>
            <select
              value={authLevel}
              onChange={(e) => setAuthLevel(e.target.value)}
            >
              <option value="operator">Operator</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            className="um-button"
            onClick={handleCreateUser}
          >
            Create User
          </button>
        </>
      )}

      {/* ================= DELETE USER ================= */}
      {activeTab === "delete" && (
        <>
          <h2>Delete User</h2>

          <div className="um-field">
            <label>Select User</label>

            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select User</option>

              {users.map((user) => (
              <option
  key={user.user_no}
  value={user.user_name}
>
  {user.user_name}
</option>
              ))}
            </select>
          </div>

          <button
            className="um-delete-btn"
            onClick={handleDeleteUser}
          >
            Delete User
          </button>
        </>
      )}

    </div>
  </div>
);
}

export default UserManagementPage