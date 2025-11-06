import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'
import ceatlogo from '../../images/logo1.jpg'

const Navbar = () => {
  return (
    <div className='Navbar'>
      <div className="logo">
        <img src={ceatlogo} alt="logo" />
      </div>
      <div className="link">
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Recipe Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/material-management"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Material Management
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/report"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Report
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/add-edit-recipe"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Add/Edit Recipe
            </NavLink>
          </li> */}
        </ul>
      </div>
    </div>
  )
}

export default Navbar
