import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function DowntimeReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sub-navbar modal states
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSr, setDeleteSr] = useState("");

  const handleSearch = async () => {
    if (!fromDate || !toDate) {
      toast.warning("Please select both From and To dates");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/downtime/getDowntime/byDateTime`,
        {
          from: new Date(fromDate).toISOString(),
          to: new Date(toDate).toISOString(),
        }
      );
      const apiData = response.data.downtime_data || [];
      setData(apiData);
      setEditValues(JSON.parse(JSON.stringify(apiData)));
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch data from API");
    }
    setLoading(false);
  };

  const handleEditAll = () => setIsEditing(true);

  const handleSaveAll = async () => {
    try {
      const response = await axios.post(`${apiUrl}/downtime/updateDowntime`, {
        downtime_data: editValues,
      });

      if (response.data.status === true) {
        toast.success("Data saved successfully!");
        setData(editValues);
        setIsEditing(false);
      } else {
        toast.error("Update failed on server.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating downtime values.");
    }
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...editValues];
    updated[index][field] = value;
    setEditValues(updated);
  };

  // Download Report
const handleDownloadReport = async () => {
  if (!fromDate || !toDate) {
    toast.warning("Please select both From and To dates");
    return;
  }

  try {
    const response = await axios.post(
      `${apiUrl}/downtime/generateReport`,
      {
        from: new Date(fromDate).toISOString(),
        to: new Date(toDate).toISOString(),
      },
      { responseType: "blob" }
    );

    // 👉 Create timestamp (safe for filenames)
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-"); // replaces : and . to avoid filename issues

    const fileName = `Downtime report generated on ${timestamp}.xlsx`;

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();

    setShowDownloadModal(false);
    toast.success("Report downloaded successfully!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to download report");
  }
};


  // Delete Downtime
  const handleDeleteDowntime = async () => {
    if (!deleteSr) {
      toast.warning("Please enter SR to delete");
      return;
    }

    try {
      await axios.post(`${apiUrl}/downtime/deleteDowntime`, {
        sr: Number(deleteSr),
      });
      toast.success("Downtime deleted successfully");
      setShowDeleteModal(false);
      handleSearch(); // Refresh data
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete downtime");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          width: "95%",
          background: "#fff",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Downtime Report
        </h2>

        {/* Sub-navbar */}
        <div style={subNavbarStyle}>
          <button style={subNavButtonStyle} onClick={() => setShowDownloadModal(true)}>
            Download Report
          </button>
          <button
            style={{ ...subNavButtonStyle, background: "#dc3545" }}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Downtime
          </button>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1" }}>
            <label style={labelStyle}>From Date</label>
            <input
              type="datetime-local"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ flex: "1" }}>
            <label style={labelStyle}>To Date</label>
            <input
              type="datetime-local"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button onClick={handleSearch} style={buttonStyle}>
            {loading ? "Loading..." : "Search"}
          </button>

          {!isEditing ? (
            <button
              onClick={handleEditAll}
              style={{ ...buttonStyle, background: "#ffc107" }}
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleSaveAll}
              style={{ ...buttonStyle, background: "#28a745" }}
            >
              Save All
            </button>
          )}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead style={theadStyle}>
              <tr>
                {[
                  "Sr",
                  "DTTM",
                  "Shift",
                  "Downtime Start",
                  "Downtime Stop",
                  "Total Downtime",
                  "Error Code",
                  "Category",
                  "Sub Category",
                  "Current Login",
                  "Description",
                ].map((col) => (
                  <th key={col} style={thStyle}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    style={{ textAlign: "center", padding: "10px" }}
                  >
                    No Data Found
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr key={row.sr}>
                    <td style={tdStyle}>{row.sr}</td>
                    <td style={tdStyle}>{row.DTTM}</td>
                    <td style={tdStyle}>{row.shift}</td>
                    <td style={tdStyle}>{row.downtime_start}</td>
                    <td style={tdStyle}>{row.downtime_stop}</td>
                    <td style={tdStyle}>{row.total_downtime}</td>

                    {[
                      "error_code",
                      "category",
                      "sub_category",
                      "current_login",
                      "description",
                    ].map((field) => (
                      <td key={field} style={tdStyle}>
                        {isEditing ? (
                          ["error_code", "category", "sub_category"].includes(
                            field
                          ) ? (
                            <select
                              value={editValues[index][field] || "Other"}
                              onChange={(e) =>
                                handleFieldChange(index, field, e.target.value)
                              }
                              style={{ ...inputStyle, marginBottom: "0" }}
                            >
                              {field === "error_code" &&
                                [
                                  "Other",
                                  ...Array.from({ length: 10 }, (_, i) => `E${101 + i}`),
                                ].map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              {field === "category" &&
                                [
                                  "Other",
                                  ...Array.from({ length: 10 }, (_, i) => `CAT${1 + i}`),
                                ].map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              {field === "sub_category" &&
                                [
                                  "Other",
                                  ...Array.from({ length: 10 }, (_, i) => `SUB CAT${1 + i}`),
                                ].map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                            </select>
                          ) : (
                            <input
                              value={editValues[index][field]}
                              onChange={(e) =>
                                handleFieldChange(index, field, e.target.value)
                              }
                              style={{ ...inputStyle, marginBottom: "0" }}
                            />
                          )
                        ) : (
                          row[field]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>Download Report</h3>
            <label>From Date</label>
            <input
              type="datetime-local"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={inputStyle}
            />
            <label>To Date</label>
            <input
              type="datetime-local"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={inputStyle}
            />
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" ,}}>
              <button style={buttonStyle} onClick={handleDownloadReport}>
                Save & Download
              </button>
              <button
                style={{ ...buttonStyle, background: "#6c757d" }}
                onClick={() => setShowDownloadModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>Delete Downtime</h3>
            <label>SR Number</label>
            <input
              type="number"
              value={deleteSr}
              onChange={(e) => setDeleteSr(e.target.value)}
              style={inputStyle}
            />
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button
                style={{ ...buttonStyle, background: "#dc3545" }}
                onClick={handleDeleteDowntime}
              >
                Submit
              </button>
              <button
                style={{ ...buttonStyle, background: "#6c757d" }}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast container */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

/* Shared inline styles */
const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #bbb",
  fontSize: "14px",
  marginTop: "5px",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "5px",
};

const buttonStyle = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  background: "#007bff",
  color: "#fff",
  cursor: "pointer",
  fontSize: "14px",
  alignSelf: "flex-end",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  background: "#f4f4f4",
  textAlign: "left",
  fontWeight: "bold",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

const theadStyle = {
  background: "#f0f0f0",
};

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "500px",
  height:"300px",
  display: "flex",
  flexDirection: "column",
};

const subNavbarStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  justifyContent:"end"
};

const subNavButtonStyle = {
  
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  background: "#007bff",
  color: "#fff",
  cursor: "pointer",
  fontSize: "14px",
};
