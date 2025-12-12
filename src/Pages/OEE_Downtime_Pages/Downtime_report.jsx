import React, { useState } from "react";
import axios from "axios";
import "./DowntimeReport.css";

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
      "http://192.168.1.194:3000/downtime/getDowntime/byDateTime",
      {
        from: new Date(fromDate).toISOString(),
        to: new Date(toDate).toISOString()
      }
    );

    const apiData = response.data.downtime_data || [];

    setData(apiData);
    setEditValues(JSON.parse(JSON.stringify(apiData)));  // <--- FIXED
  } catch (error) {
    console.error("Error fetching API data:", error);
    alert("Failed to fetch data from API");
  }

  setLoading(false);
};


  const handleEditAll = () => {
    setIsEditing(true);
  };

const handleSaveAll = async () => {
  console.log("DATA BEING SENT TO BACKEND:", editValues);

  try {
    const sanitizedData = editValues;  // <--- FIXED

    const response = await axios.post(
      "http://192.168.1.194:3000/downtime/updateDowntime",
      { downtime_data: sanitizedData }
    );

    if (response.data.status === true) {
      alert("Data saved successfully!");
      setData(editValues);
      setIsEditing(false);
    } else {
      alert("Update failed on server.");
    }
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error updating downtime values.");
  }
};



  const handleFieldChange = (index, field, value) => {
    const updated = [...editValues];
    updated[index][field] = value;
    setEditValues(updated);
  };

  return (
    <div className="container">
      <h2>Downtime Report</h2>

      {/* Filters */}
      <div className="filters">
        <div>
          <label>From Date</label>
          <input
            type="datetime-local"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label>To Date</label>
          <input
            type="datetime-local"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button className="btn" onClick={handleSearch}>
          {loading ? "Loading..." : "Search"}
        </button>

        {!isEditing ? (
          <button className="btn edit" onClick={handleEditAll}>Edit</button>
        ) : (
          <button className="btn save" onClick={handleSaveAll}>Save All</button>
        )}
      </div>

      {/* Table */}
      <table className="styled-table">
        <thead>
          <tr>
            <th>Sr</th>
            <th>DTTM</th>
            <th>Shift</th>
            <th>Downtime Start</th>
            <th>Downtime Stop</th>
            <th>Total Downtime</th>
            <th>Error Code</th>
            <th>Category</th>
            <th>Sub Category</th>
            <th>Current Login</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="11" style={{ textAlign: "center" }}>
                No Data Found
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.sr}>
                <td>{row.sr}</td>
                <td>{row.DTTM}</td>
                <td>{row.shift}</td>
                <td>{row.downtime_start}</td>
                <td>{row.downtime_stop}</td>
                <td>{row.total_downtime}</td>

                {/* Editable fields */}
                <td>
                  {isEditing ? (
                    <input
                      value={editValues[index].error_code}
                      onChange={(e) =>
                        handleFieldChange(index, "error_code", e.target.value)
                      }
                    />
                  ) : (
                    row.error_code
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <input
                      value={editValues[index].category}
                      onChange={(e) =>
                        handleFieldChange(index, "category", e.target.value)
                      }
                    />
                  ) : (
                    row.category
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <input
                      value={editValues[index].sub_category}
                      onChange={(e) =>
                        handleFieldChange(index, "sub_category", e.target.value)
                      }
                    />
                  ) : (
                    row.sub_category
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <input
                      value={editValues[index].current_login}
                      onChange={(e) =>
                        handleFieldChange(index, "current_login", e.target.value)
                      }
                    />
                  ) : (
                    row.current_login
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <input
                      value={editValues[index].description}
                      onChange={(e) =>
                        handleFieldChange(index, "description", e.target.value)
                      }
                    />
                  ) : (
                    row.description
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
