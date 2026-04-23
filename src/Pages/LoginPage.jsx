import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ceatlogo from '../images/logo1.jpg'
import './LoginPage.css'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = () => {
    if (username === 'Admin' && password === 'Admin@1234') {
      navigate('/recipe-page') // make sure this route exists
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <div className="lp-wrapper">
      <div className="lp-container">

        <div className="lp-logo">
          <img src={ceatlogo} alt="logo" />
        </div>

        <div className="lp-fields">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="lp-button" onClick={handleLogin}>
          Login
        </button>

      </div>
    </div>
  )
}

export default LoginPage