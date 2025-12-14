import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

      if (res.data.BATCH_NAME?.length) {
        setBatchList(res.data.BATCH_NAME);
        toast.success("Batch names loaded successfully!");
      } else {
        toast.info("No batch names found for selected dates");
        setBatchList([]);
      }

      setSelectedBatch("");
      setSerialList([]);
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Error fetching batch names!"
      );
    }
  };

  const fetchSerialNumbers = async (batch) => {
    if (!batch) return;

    if (batch === "All") {
      setSerialList(["All"]);
      setSelectedSerial("All");
      toast.info("Serial set to All");
      return;
    }

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
      setSelectedSerial("");
      toast.success("Serial numbers fetched!");
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Error fetching serial numbers!"
      );
    }
  };

  const downloadReport = async () => {
    if (!selectedBatch) {
      toast.warning("Please select a batch");
      return;
    }
    if (!selectedSerial) {
      toast.warning("Please select a serial number");
      return;
    }

    const requestData = {
      from: `${fromDate} 00:00:00`,
      to: `${toDate} 23:59:59`,
      batch_name: selectedBatch,
      serial_no: selectedSerial,
    };

    try {
      const res = await axios.post(
        `${apiUrl}/report/summary/getExcelReport`,
        requestData,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      // create timestamp (YYYY-MM-DD_HH-mm-ss)
const now = new Date();
const timestamp = now
  .toISOString()
  .replace(/:/g, "-")
  .replace("T", "_")
  .split(".")[0];

a.download = `SummaryReport Generated on ${timestamp}.xlsx`;

      a.click();

      toast.success("Report downloaded successfully!");
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Failed to download report!"
      );
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
      {/* TOASTS */}
      <ToastContainer position="bottom-right" />

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
              <option value="All">All</option>
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
                  disabled={selectedBatch === "All"}
                >
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

// Shared inline styles below (unchanged)
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
