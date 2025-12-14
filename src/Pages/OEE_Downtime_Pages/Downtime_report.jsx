import React, { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export default function DowntimeReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates");
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
      alert("Failed to fetch data from API");
    }
    setLoading(false);
  };

  const handleEditAll = () => setIsEditing(true);

  const handleSaveAll = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/downtime/updateDowntime`,
        { downtime_data: editValues }
      );

      if (response.data.status === true) {
        alert("Data saved successfully!");
        setData(editValues);
        setIsEditing(false);
      } else {
        alert("Update failed on server.");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating downtime values.");
    }
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...editValues];
    updated[index][field] = value;
    setEditValues(updated);
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
          maxWidth: "1200px",
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
                  <td colSpan="11" style={{ textAlign: "center", padding: "10px" }}>
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

                    {/* Editable fields */}
                    {[
                      "error_code",
                      "category",
                      "sub_category",
                      "current_login",
                      "description",
                    ].map((field) => (
                      <td key={field} style={tdStyle}>
                        {isEditing ? (
                          <input
                            value={editValues[index][field]}
                            onChange={(e) =>
                              handleFieldChange(index, field, e.target.value)
                            }
                            style={{ ...inputStyle, marginBottom: "0" }}
                          />
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
