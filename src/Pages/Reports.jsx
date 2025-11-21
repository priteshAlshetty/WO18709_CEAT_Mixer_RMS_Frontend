import React from 'react';
import { Outlet } from 'react-router-dom';
import './Report.css';
import ReportNavbar from '../Components/ReportNavbar';

const Reports = () => {
  return (
    <div className="page-container">
      <div className="left">
        <div className="Report-title">Report Selection</div>
        <ReportNavbar />
      </div>

      <div className="Right">
      
        {/* Nested Route Output Goes Here */}
        <Outlet />
      </div>
    </div>
  );
}

export default Reports;
