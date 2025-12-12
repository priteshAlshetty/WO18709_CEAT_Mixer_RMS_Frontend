import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OperatorLog = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

const downloadReport = async () => {
  if (!fromDate || !toDate) {
    toast.error("Please select both dates.");
    return;
  }

  try {
    setLoading(true);

    const response = await axios.post(
      "http://192.168.1.194:3000/report/alarm/generateReport",
      { from: fromDate, to: toDate },
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Create timestamp (safe for filenames)
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");

    // Use the timestamp in the file name
    link.setAttribute("download", `Alarm_Report_Generated_on${timestamp}.xlsx`);

    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Report downloaded successfully!");
    setLoading(false);
  } catch (error) {
    console.error("Download failed:", error);

    let backendMessage = "Failed to download report.";

    try {
      if (error.response && error.response.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const json = JSON.parse(text);
          backendMessage = json.message || text;
        } catch {
          backendMessage = text;
        }
      }
    } catch (err) {
      console.error("Error parsing backend response:", err);
    }

    toast.error(backendMessage);
    setLoading(false);
  }
};



  return (
    <div style={styles.container}>
      {/* Toast container positioned bottom-right */}
      <ToastContainer position="bottom-right" autoClose={3000} />

      <h2 style={styles.title}>Operator's Log Report</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>From Date:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>To Date:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={styles.input}
        />
      </div>

      <button onClick={downloadReport} disabled={loading} style={styles.button}>
        {loading ? "Downloading..." : "Download Excel"}
      </button>
    </div>
  );
};

// Simple UI styles
const styles = {
  container: {
    width: "400px",
    margin: "50px auto",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    background: "#fff",
    fontFamily: "Arial"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  formGroup: {
    marginBottom: "15px"
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "bold"
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "5px"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default OperatorLog;
