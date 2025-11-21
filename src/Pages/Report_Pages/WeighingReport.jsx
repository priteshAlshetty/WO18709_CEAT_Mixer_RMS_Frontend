import React, { useState } from "react";
import axios from "axios";
import "./ReportPage.css"; 
const apiUrl = import.meta.env.VITE_API_URL;

function ExcelReportDownloader() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [materialName, setMaterialName] = useState("All Material");
  const [materialType, setMaterialType] = useState("C.B.");

  const materialList = ["All Material", "Material A", "Material B", "Material C"];
  const materialTypeList = ["All","C.B.", "F.L.", "Oil1", "P.D.", "Poly"];

  const downloadReport = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/report/weighing/getExcelReport`,
        { from: fromDate, to: toDate, materialName, materialType },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Weighing_Report_${fromDate}_to_${toDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Error downloading report");
    }
  };

  return (
    <div className="report-container">
      <h2 className="report-title">Weighing Report</h2>

      <label>From Date:</label>
      <input
        className="report-input"
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />

      <label>To Date:</label>
      <input
        className="report-input"
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />

      <label>Material Name:</label>
      <select
        className="report-input"
        value={materialName}
        onChange={(e) => setMaterialName(e.target.value)}
      >
        {materialList.map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>

      <label>Material Type:</label>
      <select
        className="report-input"
        value={materialType}
        onChange={(e) => setMaterialType(e.target.value)}
      >
        {materialTypeList.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      <button className="report-button" onClick={downloadReport}>
        Download Report
      </button>
    </div>
  );
}

export default ExcelReportDownloader;
