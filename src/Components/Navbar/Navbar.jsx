import React, { useState, createContext } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'
import ceatlogo from '../../images/logo1.jpg'

export const MixerContext = createContext()

const Navbar = () => {
  const [selectedMixer, setSelectedMixer] = useState('Mixer 1')

  return (
    <MixerContext.Provider value={{ selectedMixer, setSelectedMixer }}>
      <div className="Navbar">
        <div className="left-section">
          <div className="logo">
            <img src={ceatlogo} alt="logo" />
          </div>
          <div className="Mixer-selection">Mixer Selection
            <select
              value={selectedMixer}
              onChange={(e) => setSelectedMixer(e.target.value)}
              className="mixer-dropdown"
            >
              <option value="Mixer 1">Mixer 1</option>
              <option value="Mixer 2">Mixer 2</option>
              <option value="Mixer 3">Mixer 3</option>
            </select>
          </div>
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
          </ul>
        </div>
      </div>
    </MixerContext.Provider>
  )
}

export default Navbar
