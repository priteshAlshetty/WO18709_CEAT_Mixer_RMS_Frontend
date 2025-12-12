import React, { useState, useEffect } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export default function SummaryReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [batchList, setBatchList] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  const [serialList, setSerialList] = useState([]);
  const [selectedSerial, setSelectedSerial] = useState("");

  useEffect(() => {
    if (fromDate && toDate) fetchBatchNames();
  }, [fromDate, toDate]);

  const fetchBatchNames = async () => {
    try {
      const res = await axios.post(
        `${apiUrl}/report/summary/getBatchName/byDateTime`,
        {
          from: `${fromDate} 00:00:00`,
          to: `${toDate} 23:59:59`,
        }
      );
      setBatchList(res.data.BATCH_NAME || []);
      setSelectedBatch("");
      setSerialList([]);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSerialNumbers = async (batch) => {
    if (!batch) return;

    try {
      const res = await axios.post(
        `${apiUrl}/report/summary/getSerial/byBatchName`,
        {
          from: `${fromDate} 00:00:00`,
          to: `${toDate} 23:59:59`,
          batch_name: batch,
        }
      );

      const serials = res.data.SERIAL_NO || [];
      setSerialList(["All", ...serials]);
    } catch (e) {
      console.error(e);
    }
  };

  const downloadReport = async () => {
    if (!selectedBatch) return alert("Please select Batch");
    if (!selectedSerial) return alert("Please select Serial");

    try {
      const res = await axios.post(
        `${apiUrl}/report/summary/getExcelReport`,
        {
          from: `${fromDate} 00:00:00`,
          to: `${toDate} 23:59:59`,
          batch_name: selectedBatch,
          serial_no: selectedSerial === "All" ? null : Number(selectedSerial),
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "Summary_Report.xlsx";
      a.click();
    } catch (e) {
      console.error(e);
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
          Summary Report
        </h2>

        {/* Date Range Card */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Select Date Range</h3>

          <label style={labelStyle}>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Batch Section */}
        {batchList.length > 0 && (
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Batch Details</h3>

            <label style={labelStyle}>Batch Name</label>
            <select
              value={selectedBatch}
              onChange={(e) => {
                setSelectedBatch(e.target.value);
                fetchSerialNumbers(e.target.value);
              }}
              style={inputStyle}
            >
              <option value="">Select Batch</option>
              {batchList.map((b, i) => (
                <option key={i} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {serialList.length > 0 && (
              <>
                <label style={labelStyle}>Serial Number</label>
                <select
                  value={selectedSerial}
                  onChange={(e) => setSelectedSerial(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Select Serial</option>
                  {serialList.map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        )}

        {/* Download Button */}
        {selectedSerial && (
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
            ⬇ Download Report
          </button>
        )}
      </div>
    </div>
  );
}

/* Shared inline styles */
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

const cardStyle = {
  padding: "15px",
  borderRadius: "8px",
  background: "#f8f8f8",
  marginBottom: "20px",
};

const sectionTitle = {
  marginBottom: "10px",
  fontSize: "16px",
  fontWeight: "600",
};

