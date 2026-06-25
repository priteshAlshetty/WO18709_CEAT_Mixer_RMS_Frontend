import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ceatlogo from '../images/logo1.jpg'
import './LoginPage.css'
import axiosInstance from '../api/axios'

const LoginPage = () => {
  const [username, setUsername] = useState('Admin')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  
  

 const handleLogin = async () => {
  try {
   const response = await axiosInstance.post('/auth/login', {
  username,
  password
})

    if (response.data.success) {
      // Save token
      localStorage.setItem('token', response.data.token)

      // Navigate to next page
      navigate('/recipe-page')
    } else {
      alert(response.data.error)
    }
  } catch (error) {
    console.error(error)
    alert('Login failed')
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