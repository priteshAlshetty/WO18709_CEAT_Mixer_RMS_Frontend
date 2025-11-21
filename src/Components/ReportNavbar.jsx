import React from 'react'
import { NavLink } from 'react-router-dom'   // <-- REQUIRED

const ReportNavbar = () => {
  return (
    <div className="navbar-list">
      <ul>
        <li><NavLink to="weighing"  className={({ isActive }) => (isActive ? 'active-link' : '')}>Weighing Report</NavLink></li>
        <li><NavLink to="batch"  className={({ isActive }) => (isActive ? 'active-link' : '')}>Batch Report</NavLink></li>
        <li><NavLink to="summary"  className={({ isActive }) => (isActive ? 'active-link' : '')}>Summary Report</NavLink></li>
        <li><NavLink to="cleanout"  className={({ isActive }) => (isActive ? 'active-link' : '')}>cleanout Report</NavLink></li>
        <li><NavLink to="#">Report 4</NavLink></li>
      </ul>
    </div>
  );
}


export default ReportNavbar
