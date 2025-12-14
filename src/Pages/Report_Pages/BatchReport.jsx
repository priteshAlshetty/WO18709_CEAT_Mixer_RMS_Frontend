import React, { useState, useEffect } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export default function ReportPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [batchNames, setBatchNames] = useState([]);
  const [selectedBatchName, setSelectedBatchName] = useState("");

  const [serialNumbers, setSerialNumbers] = useState([]);
  const [selectedSerial, setSelectedSerial] = useState("");

  const [batchNumbers, setBatchNumbers] = useState([]);
  const [selectedBatchNo, setSelectedBatchNo] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [reportReady, setReportReady] = useState(false);

  useEffect(() => {
    if (fromDate && toDate) fetchBatchNames();
  }, [fromDate, toDate]);

  const fetchBatchNames = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await axios.post(`${apiUrl}/report/batch/getBatchName/bydate`, {
        from: fromDate,
        to: toDate
      });
      const list = res.data.BATCH_NAME || [];
      setBatchNames(["All", ...list]);

      setSelectedBatchName("");
      setSerialNumbers([]);
      setBatchNumbers([]);
      setSelectedSerial("");
      setSelectedBatchNo("");
      setReportReady(false);
    } catch {
      setErrorMsg("Failed to fetch batch names.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSerialNumbers = async (batchName) => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await axios.post(`${apiUrl}/report/batch/getSerial/byBatchName`, {
        batchName: batchName === "All" ? batchNames.slice(1) : [batchName],
        from: fromDate,
        to: toDate
      });
      setSerialNumbers(res.data.SERIAL_NO || []);
      setSelectedSerial("");
      setBatchNumbers([]);
      setSelectedBatchNo("");
      setReportReady(false);
    } catch {
      setErrorMsg("Failed to fetch serial numbers.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchNumbers = async (serialNo) => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await axios.post(`${apiUrl}/report/batch/getbatchNo/bySerialNo`, {
        serialNo
      });
      setBatchNumbers(["All", ...(res.data.BATCH_NO || [])]);
      setSelectedBatchNo("");
      setReportReady(false);
    } catch {
      setErrorMsg("Failed to fetch batch numbers.");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await axios.post(
        `${apiUrl}/report/batch/getExcelReport`,
        {
          recipeId: selectedBatchName,
          serialNo: selectedSerial,
          batchNo: selectedBatchNo,
          dttmFrom: fromDate,
          dttmTo: toDate
        },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Report.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch {
      setErrorMsg("Failed to download report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "40px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          width: "450px",
          background: "#fff",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "20px"
          }}
        >
          Batch Report Generator
        </h2>

        {errorMsg && (
          <div
            style={{
              background: "#ffdddd",
              color: "#b30000",
              padding: "10px",
              borderLeft: "5px solid red",
              marginBottom: "15px"
            }}
          >
            {errorMsg}
          </div>
        )}

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={inputStyle}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={inputStyle}
        />

        {batchNames.length > 0 && (
          <select
            value={selectedBatchName}
            onChange={(e) => {
              setSelectedBatchName(e.target.value);
              fetchSerialNumbers(e.target.value);
            }}
            style={inputStyle}
          >
            <option value="">Select Batch</option>
            {batchNames.map((bn, i) => (
              <option key={i} value={bn}>
                {bn}
              </option>
            ))}
          </select>
        )}

        {serialNumbers.length > 0 && (
          <select
            value={selectedSerial}
            onChange={(e) => {
              setSelectedSerial(e.target.value);
              fetchBatchNumbers(e.target.value);
            }}
            style={inputStyle}
          >
            <option value="">Select Serial No</option>
            {serialNumbers.map((sn, i) => (
              <option key={i} value={sn}>
                {sn}
              </option>
            ))}
          </select>
        )}

        {batchNumbers.length > 0 && (
          <select
            value={selectedBatchNo}
            onChange={(e) => {
              setSelectedBatchNo(e.target.value);
              setReportReady(true);
            }}
            style={inputStyle}
          >
            <option value="">Select Batch No</option>
            {batchNumbers.map((bn, i) => (
              <option key={i} value={bn}>
                {bn}
              </option>
            ))}
          </select>
        )}

        {reportReady && (
          <button
            onClick={downloadReport}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "gray" : "#007bff",
              color: "white",
              padding: "12px",
              fontSize: "16px",
              border: "none",
              borderRadius: "6px",
              marginTop: "10px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Loading..." : "Download Report"}
          </button>
        )}
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
  fontSize: "15px"
};
