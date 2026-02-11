import React, { useState } from "react";
// import axios from "axios";
import api from "../../api/axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_API_URL;

function ExcelReportDownloader() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [materialName, setMaterialName] = useState("All Material");
  const [materialType, setMaterialType] = useState("C.B.");

  const materialList = ["All Material", "Material A", "Material B", "Material C"];
  const materialTypeList = ["C.B.", "F.L.", "Oil1", "P.D.", "Poly"];
const [isDownloading, setIsDownloading] = useState(false);



const downloadReport = async () => {
  try {
    setIsDownloading(true); // ✅ start loading

    const payload = {
      from: fromDate,
      to: toDate,
      materialName,
      materialType,
    };

    console.log("Downloading report with payload:", payload);

    const res = await api.post(
      `/report/weighing/getExcelReport`,
      payload,
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

    toast.success("Report downloaded successfully!");
  } catch (error) {
    if (error.response && error.response.data) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const errorObj = JSON.parse(reader.result);
          toast.error(errorObj.message || "Something went wrong");
        } catch {
          toast.error("Failed to download report");
        }
      };
      reader.readAsText(error.response.data);
    } else {
      toast.error("Network error or server unreachable");
    }
  } finally {
    setIsDownloading(false); // ✅ reset button
  }
};




  return (
    <>
      {/* Toast Container */}
      <ToastContainer position="bottom-right" autoClose={3000} />

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

          <label style={labelStyle}>From Date & Time:</label>
          <input
            type="datetime-local"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={inputStyle}
          />


          <label style={labelStyle}>To Date & Time:</label>
          <input
            type="datetime-local"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={inputStyle}
          />


          {/* <label style={labelStyle}>Material Name:</label>
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
          </select> */}

         <button
  onClick={downloadReport}
  disabled={isDownloading}
  style={{
    width: "100%",
    background: isDownloading ? "gray" : "#007bff",
    color: "white",
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    marginTop: "10px",
    cursor: isDownloading ? "not-allowed" : "pointer",
    opacity: isDownloading ? 0.8 : 1,
  }}
>
  {isDownloading ? "Downloading..." : "Download Report"}
</button>

        </div>
      </div>
    </>
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
