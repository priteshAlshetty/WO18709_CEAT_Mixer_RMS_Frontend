import React from 'react'
import { NavLink } from 'react-router-dom'   // <-- REQUIRED

const ReportNavbar = () => {
  return (
    <div className="navbar-list">
      <ul>
        <li><NavLink to="downtime-Report"  className={({ isActive }) => (isActive ? 'active-link' : '')}>Downtime Report</NavLink></li>
        <li><NavLink to="oee"  className={({ isActive }) => (isActive ? 'active-link' : '')}>OEE</NavLink></li>
        <li><NavLink to="batch-hold"  className={({ isActive }) => (isActive ? 'active-link' : '')}>Batch Hold</NavLink></li>
        {/* <li><NavLink to="#">Report 4</NavLink></li> */}
      </ul>
    </div>
  );
}


export default ReportNavbar
