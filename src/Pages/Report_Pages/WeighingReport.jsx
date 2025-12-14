import React, { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

function ExcelReportDownloader() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [materialName, setMaterialName] = useState("All Material");
  const [materialType, setMaterialType] = useState("C.B.");

  const materialList = ["All Material", "Material A", "Material B", "Material C"];
  const materialTypeList = ["C.B.", "F.L.", "Oil1", "P.D.", "Poly"];

  const downloadReport = async () => {
    try {
      const res = await axios.post(
        `${apiUrl}/report/weighing/getExcelReport`,
        { from: fromDate, to: toDate, materialName, materialType },
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Weighing_Report_${fromDate}_to_${toDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error downloading report");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "450px",
          background: "#fff",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Weighing Report
        </h2>

        <label style={labelStyle}>From Date:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>To Date:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>Material Name:</label>
        <select
          value={materialName}
          onChange={(e) => setMaterialName(e.target.value)}
          style={inputStyle}
        >
          {materialList.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <label style={labelStyle}>Material Type:</label>
        <select
          value={materialType}
          onChange={(e) => setMaterialType(e.target.value)}
          style={inputStyle}
        >
          {materialTypeList.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <button
          onClick={downloadReport}
          style={{
            width: "100%",
            background: "#007bff",
            color: "white",
            padding: "12px",
            fontSize: "16px",
            border: "none",
            borderRadius: "6px",
            marginTop: "10px",
            cursor: "pointer",
          }}
        >
          Download Report
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  border: "1px solid #bbb",
  borderRadius: "6px",
  fontSize: "15px",
};

const labelStyle = {
  fontWeight: "bold",
  marginBottom: "5px",
  display: "block",
};

export default ExcelReportDownloader;
