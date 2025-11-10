import React, { useState } from "react";
import axios from "axios";

const ReportPage = () => {
  const [shiftType, setShiftType] = useState("A");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleDownload = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates.");
      return;
    }

    const requestData = {
      shiftType,
      fromDate,
      toDate,
    };

    try {
      const response = await axios.post("/api/report/download", requestData, {
        responseType: "blob", // Expect file download
      });

      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Report_${shiftType}_${fromDate}_${toDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download report.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Download Report</h2>

      <div style={{ marginBottom: 15 }}>
        <label>Shift / Type:</label>
        <select
          value={shiftType}
          onChange={(e) => setShiftType(e.target.value)}
          style={{ display: "block", width: "100%", padding: 8, marginTop: 5 }}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>From Date:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={{ display: "block", width: "100%", padding: 8, marginTop: 5 }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>To Date:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={{ display: "block", width: "100%", padding: 8, marginTop: 5 }}
        />
      </div>

      <button
        onClick={handleDownload}
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Download
      </button>
    </div>
  );
};

export default ReportPage;
