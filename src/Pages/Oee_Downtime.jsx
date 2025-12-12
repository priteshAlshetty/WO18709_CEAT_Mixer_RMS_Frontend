import React from 'react';
import { Outlet } from 'react-router-dom';
import './Report.css';
import Oee_Downtime_Navbar from '../Components/OEE_Down_Nav';

const Reports = () => {
  return (
    <div className="page-container">
      <div className="left">
        <div className="Report-title">Selection</div>
        <Oee_Downtime_Navbar />
      </div>

      <div className="Right">
       
        {/* Nested Route Output Goes Here */}
        <Outlet />
      </div>
    </div>
  );
}

export default Reports;
 




