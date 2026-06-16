import React, { useState } from 'react'
import axiosInstance from '../api/axios'
import './UserManagementPage.css'

const UserManagementPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authLevel, setAuthLevel] = useState('operator')

  const handleCreateUser = async () => {
    try {
      const response = await axiosInstance.post('/auth/signup', {
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
      <div className="um-card">
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
            type="password"
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
      </div>
    </div>
  )
}

export default UserManagementPage