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

      setSerialNumbers(["All", ...(res.data.SERIAL_NO || [])]);
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
          Batch Report
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

        <div>
          <label htmlFor="fromDate" style={{"font-weight": "bold"}}>From Date</label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="toDate" style={{"font-weight": "bold"}}>To Date</label>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {batchNames.length > 0 && (
          <div>
            <label htmlFor="batchSelect" style={{"font-weight": "bold"}}>Batch Name</label>
            <select
              id="batchSelect"
              value={selectedBatchName}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedBatchName(value);

                if (value === "All") {
                  setSerialNumbers(["All"]);
                  setSelectedSerial("All");

                  setBatchNumbers(["All"]);
                  setSelectedBatchNo("All");

                  setReportReady(true);
                } else {
                  fetchSerialNumbers(value);
                }
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
          </div>
        )}

        {serialNumbers.length > 0 && (
          <div>
            <label htmlFor="serialSelect" style={{"font-weight": "bold"}}>Serial Number</label>
            <select
              id="serialSelect"
              value={selectedSerial}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedSerial(value);

                if (value === "All") {
                  setBatchNumbers(["All"]);
                  setSelectedBatchNo("All");
                  setReportReady(true);
                } else {
                  fetchBatchNumbers(value);
                }
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
          </div>
        )}

        {batchNumbers.length > 0 && (
          <div>
            <label htmlFor="batchNoSelect" style={{"font-weight": "bold"}}>Batch Number</label>
            <select
              id="batchNoSelect"
              value={selectedBatchNo}
              disabled={selectedSerial === "All"}
              onChange={(e) => {
                setSelectedBatchNo(e.target.value);
                setReportReady(true);
              }}
              style={{
                ...inputStyle,
                backgroundColor: selectedSerial === "All" ? "#eee" : "white",
                cursor: selectedSerial === "All" ? "not-allowed" : "pointer"
              }}
            >
              <option value="">Select Batch No</option>
              {batchNumbers.map((bn, i) => (
                <option key={i} value={bn}>
                  {bn}
                </option>
              ))}
            </select>
          </div>
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
