import React from 'react'
import ceatlogo from '../images/logo1.jpg'
import './LoginPage.css'

const LoginPage = () => {
  return (
    <div className="lp-wrapper">
      <div className="lp-container">

        <div className="lp-logo">
          <img src={ceatlogo} alt="logo" />
        </div>

        <div className="lp-fields">
          <label>Username</label>
          <input type="text" placeholder="Enter username" />

          <label>Password</label>
          <input type="password" placeholder="Enter password" />
        </div>

        <button className="lp-button">Login</button>

      </div>
    </div>
  )
}

export default LoginPage
