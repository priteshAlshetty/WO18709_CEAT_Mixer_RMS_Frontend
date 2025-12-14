import React, { useEffect, useState } from "react";
import "./MaterialManager.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const apiUrl = import.meta.env.VITE_API_URL;

const MaterialManager = () => {
  const [formData, setFormData] = useState({
    materialName: "",
    materialCode: "",
    category: "",
  });

  const [materials, setMaterials] = useState({
    CB: [],
    PD: [],
    FL: [],
    POLY: [],
    OIL_1: [],
    OIL_2: [],
  });

  const [loading, setLoading] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false); // ✅ for delete modal
  const [deleteCode, setDeleteCode] = useState(""); // ✅ for material code input

  // Fetch data
  const fetchMaterials = async () => {
    try {
      const res = await fetch(`${apiUrl}/material/getMaterials`);
      const data = await res.json();
      setMaterials(data);
    } catch (err) {
      console.error("Error fetching materials:", err);
    }
  };

  useEffect(() => {
    fetchMaterials();
    const interval = setInterval(fetchMaterials, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Save
  const handleSave = async () => {
    if (!formData.materialCode || !formData.materialName || !formData.category) {
      toast.error("Please fill all fields before saving.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/material/addMaterial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material_data: {
            material_code: formData.materialCode,
            material_name: formData.materialName,
            material_type: formData.category,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Material added successfully!");
        fetchMaterials();
        setFormData({ materialName: "", materialCode: "", category: "" });
      } else {
        toast.error(data.error || data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Network error. Please check the server.");
    }
  };

  // ✅ Handle Delete Material
  const handleDelete = async () => {
    if (!deleteCode.trim()) {
      toast.error("Please enter a material code to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete material: ${deleteCode}?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${apiUrl}/material/deleteMaterial`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material_data: { material_code: deleteCode },
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || "Material deleted successfully!");
        setShowDeletePopup(false);
        setDeleteCode("");
        fetchMaterials();
      } else {
        toast.error(data.message || "Failed to delete material.");
      }
    } catch (err) {
      toast.error(err.message || "Network error. Please check the server.");
    }
  };

  return (
    <div className="material-manager">
      <div className="title">
        <h2>Material Management</h2>
      </div>

      {/* ---------- FORM ---------- */}
      <div className="form-section">
        <div className="form-group">
          <label>Material Name:</label>
          <input
            type="text"
            name="materialName"
            value={formData.materialName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Material Code:</label>
          <input
            type="text"
            name="materialCode"
            value={formData.materialCode}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="CB">CB</option>
            <option value="PD">PD</option>
            <option value="FL">FL</option>
            <option value="POLY">POLY</option>
            <option value="OIL_1">OIL_1</option>
            <option value="OIL_2">OIL_2</option>
          </select>
        </div>

        <div className="form-buttons">
          <button className="save-btn" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button className="save-btn">Edit</button>
          <button
            className="cancel-btn"
            onClick={() =>
              setFormData({ materialName: "", materialCode: "", category: "" })
            }
          >
            Clear
          </button>

          {/* ✅ New Delete Material button */}
          <button
            className="delete-btn"
            onClick={() => setShowDeletePopup(true)}
          >
            Delete Material
          </button>
        </div>
      </div>

      {/* ---------- TABLES ---------- */}
      <div className="table-section">
        <div className="table-class">
          <div className="refresh-bar">
            <button className="refresh-btn" onClick={fetchMaterials}>
              ⭮ Refresh
            </button>
          </div>
        </div>

        <div className="tables-grid">
          {Object.entries(materials).map(([key, items]) => (
            <div key={key} className="table-card">
              <div className="table-header">
                <h4>{key}</h4>
                {items && typeof items.count === "number" && (
                  <span className="count-badge">{items.count}</span>
                )}
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Material Code</th>
                    <th>Material Name</th>
                  </tr>
                </thead>
                <tbody>
                  {items && Array.isArray(items.data) && items.data.length > 0 ? (
                    items.data.map((item, i) => (
                      <tr key={i}>
                        <td>{item.material_code}</td>
                        <td>{item.material_name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="no-data">
                        No Data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ DELETE POPUP MODAL */}
      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Delete Material</h3>
            <input
              type="text"
              placeholder="Enter Material Code"
              value={deleteCode}
              onChange={(e) => setDeleteCode(e.target.value)}
            />
            <div className="popup-buttons">
              <button className="delete-confirm" onClick={handleDelete}>
                Delete
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowDeletePopup(false);
                  setDeleteCode("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Toast */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default MaterialManager;
