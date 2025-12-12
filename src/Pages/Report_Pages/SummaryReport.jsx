import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SummaryReport.css";

export default function SummaryReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [batchList, setBatchList] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  const [serialList, setSerialList] = useState([]);
  const [selectedSerial, setSelectedSerial] = useState("");

  // 1️⃣ Automatically fetch batch names when both dates selected
  useEffect(() => {
    if (fromDate && toDate) {
      fetchBatchNames();
    }
  }, [fromDate, toDate]); // triggers when either date changes

  // Fetch Batch Names
  const fetchBatchNames = async () => {
    const body = {
      from: `${fromDate} 00:00:00`,
      to: `${toDate} 23:59:59`,
    };

    try {
      const res = await axios.post(
        "http://192.168.1.194:3000/report/summary/getBatchName/byDateTime",
        body
      );

      setBatchList(res.data.BATCH_NAME || []);
      setSelectedBatch("");
      setSerialList([]);
    } catch (e) {
      console.error(e);
    }
  };

  // 2️⃣ Fetch Serial Numbers when batch selected
  const fetchSerialNumbers = async (batch) => {
    if (!batch) return;

    const body = {
      from: `${fromDate} 00:00:00`,
      to: `${toDate} 23:59:59`,
      batch_name: batch,
    };

    try {
      const res = await axios.post(
        "http://192.168.1.194:3000/report/summary/getSerial/byBatchName",
        body
      );

      const serials = res.data.SERIAL_NO || [];
      setSerialList(["All", ...serials]);
    } catch (e) {
      console.error(e);
    }
  };

  // 3️⃣ Download XLSX report
  const downloadReport = async () => {
    if (!selectedBatch) return alert("Please select Batch");
    if (!selectedSerial) return alert("Please select Serial");

    const body = {
      from: `${fromDate} 00:00:00`,
      to: `${toDate} 23:59:59`,
      batch_name: selectedBatch,
      serial_no: selectedSerial === "All" ? null : Number(selectedSerial),
    };

    try {
      const res = await axios.post(
        "http://192.168.1.194:3000/report/summary/getExcelReport",
        body,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Summary_Report.xlsx");
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="report-container">
      <h2 className="title">📄 Summary Report</h2>

      <div className="card">
        <h3 className="section-title">Select Date Range</h3>

        <div className="input-group">
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      {batchList.length > 0 && (
        <div className="card">
          <h3 className="section-title">Batch Details</h3>

          <div className="input-group">
            <label>Batch Name</label>
            <select
              value={selectedBatch}
              onChange={(e) => {
                setSelectedBatch(e.target.value);
                fetchSerialNumbers(e.target.value);
              }}
            >
              <option value="">Select Batch</option>
              {batchList.map((b, i) => (
                <option key={i} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {serialList.length > 0 && (
            <div className="input-group">
              <label>Serial Number</label>
              <select
                value={selectedSerial}
                onChange={(e) => setSelectedSerial(e.target.value)}
              >
                <option value="">Select Serial</option>
                {serialList.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {selectedSerial && (
        <button className="btn download" onClick={downloadReport}>
          ⬇ Download Report
        </button>
      )}
    </div>
  );
}
