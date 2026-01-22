
// Import necessary React modules and styles
import React, { useState, useEffect, useContext } from "react";
import './RecipePage.css';
import api from "../api/axios"; // adjust path if needed

// import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route, useNavigate, NavLink } from 'react-router-dom';
import { MixerContext } from "../context/MixerContext";


const apiUrl = import.meta.env.VITE_API_URL;


/* ----------------------------------------
  Mixing Action Dropdown Options (static fallback)
---------------------------------------- */
const staticMixingActions = [
  " ", // Represents the null/empty option
  "Add Poly",
  "Keeping",
  "Open Feed Door",
  "Close Feed Door",
  "Add Chemical",
  "Ram Float",
  "Add Oil2",
  "Add WF",
  "Ram UP & Discharge Door Open",
  "Close Discharge Door & Open Feed Door",
  "Ram Float & Open Discharge Door",
  "Add Carbon",
  "Add Carbon & Add WF",
  "Add Oil1",
  "Open Discharge Door",
  "Close Discharge Door",
  "Ram Up",
  "Ram Up Middle",
  "Ram Down",
  "Recipe Finish"
];

const staticMixConditions = [
  " ", // Represents the null/empty option
  "Time",
  "TimeAndTempAndEnergy",
  "SimultaneityExecute",
  "Recipe Finish",
  "Time or Temp",
  "Temp",
  "Energy",
  "Time And Temp",
  "Time And Energy",
  "Temp And Energy",
  "(Time Or Temp)And EG",
  "(Time Or EG)And Temp",
  "(Temp Or EG)And Time"
];




/* ----------------------------------------
  Utility Functions
---------------------------------------- */
// function humanizeKey(key) {
//   return key
//     .replace(/([A-Z])/g, " $1")
//     .replace(/_/g, " ")
//     .replace(/\s+/g, " ")
//     .trim()
//     .replace(/\b\w/g, (c) => c.toUpperCase());
// }

function humanizeKey(key) {
  // Replace underscores with space
  let result = key.replace(/_/g, ' ');

  // Insert space before capital letters, only if preceded by a lowercase letter or digit
  result = result.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

  // Capitalize first letter of each word
  return result
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


// function formatValue(key, value) {
//   if (value === null || value === undefined) return "-";

//   const lowerKey = key.toLowerCase();

//   // Prevent converting numeric durations like mix_time into dates
//   const isDurationField = ["mix_time", "time"].includes(lowerKey);
//   if (!isDurationField && (lowerKey.includes("time") || lowerKey.includes("date"))) {
//     const d = new Date(value);
//     if (!isNaN(d)) return d.toLocaleString();
//   }

//   return value;
// }
const formatValue = (key, val) => {
  const boolFields = ["CBReclaim", "UsingStatus", "UseThreeTMP"];

  // Handle boolean flags
  if (boolFields.includes(key)) {
    // Convert 1/0 to boolean safely
    const isTrue = val === true || val === 1 || val === "1";
    return isTrue ? "✅" : "❌";
  }

  if (val === null || val === undefined || val === "") return "-";
  return val;
};



// function getInputType(key, value) {
//   const lowerKey = key.toLowerCase();
//   const normalizedKey = lowerKey.replace(/[^a-z]/g, "");
//   const checkboxTextFields = new Set(["usethreetmp", "cbreclaim", "usingstatus"]);

//   if (checkboxTextFields.has(normalizedKey)) return "checkbox-text";
//   if (typeof value === "number") return "number";
//   if (typeof value === "boolean" || lowerKey.includes("status") || lowerKey.includes("activate")) return "boolean";

//   // ⛔ Avoid treating "mix_time" or similar as datetime
//   if ((lowerKey.includes("time") || lowerKey.includes("date")) && !["mix_time", "time"].includes(lowerKey)) {
//     return "datetime-local";
//   }

//   return "text";
// }

function getInputType(key, value) {
  const lowerKey = key.toLowerCase();
  const normalizedKey = lowerKey.replace(/[^a-z]/g, "");

  const checkboxTextFields = new Set(["usethreetmp", "cbreclaim", "usingstatus"]);

  if (checkboxTextFields.has(normalizedKey)) return "checkbox-text";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean" || lowerKey.includes("status") || lowerKey.includes("activate")) return "boolean";

  // ⛔ Prevent treating duration fields as datetime
  const durationFields = [
    "maxtimeovertempdischarge",
    "mintimeovertempdischarge",
    "timeofcbreclaim",
    "mixtime",
    "mix_time", // already handled
    "time",
    "dischargetimemin",   // ✅ Add this
    "dischargetimemax"    // ✅ Add this
  ];

  if ((lowerKey.includes("time") || lowerKey.includes("date")) && !durationFields.includes(normalizedKey)) {
    return "datetime-local";
  }

  return "text";
}


/* ----------------------------------------
  Main Component: RecipePage
---------------------------------------- */
export default function RecipePage() {
  // Get selectedMixer from context instead of local state
  const { selectedMixer } = useContext(MixerContext);

  const [recipeId, setRecipeId] = useState("");
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [mixingActions, setMixingActions] = useState([]);
  const [loadingActions, setLoadingActions] = useState(false);
  const [actionError, setActionError] = useState(null);
  
  // Local material options state (will be populated based on selectedMixer)
  const [cbMaterialOptions, setCbMaterialOptions] = useState([]);
  const [chemicalPDOptions, setChemicalPDOptions] = useState([]);
  const [fillerOptions, setFillerOptions] = useState([]);
  const [polyOptions, setPolyOptions] = useState([]);
  const [oilAOptions, setOilAOptions] = useState([]);
  const [oilBOptions, setOilBOptions] = useState([]);

  const navigate = useNavigate();


  function clearDataValues() {
    setData((prev) => {
      if (!prev) return prev;

      const clearedWeighing = {};
      for (const key in prev.recipe_weighing) {
        const val = prev.recipe_weighing[key];
        if (typeof val === "boolean") clearedWeighing[key] = false;
        else if (typeof val === "number") clearedWeighing[key] = 0;
        else clearedWeighing[key] = "";
      }

      function clearArray(arr) {
        return arr.map((item) => {
          const newItem = {};
          for (const k in item) {
            const v = item[k];
            if (typeof v === "boolean") newItem[k] = false;
            else if (typeof v === "number") newItem[k] = 0;
            else newItem[k] = "";
          }
          return newItem;
        });
      }

      return {
        ...prev,
        recipe_weighing: clearedWeighing,
        recipe_mixing: clearArray(prev.recipe_mixing),
        recipe_weight_CB: clearArray(prev.recipe_weight_CB),
        recipe_weight_poly: clearArray(prev.recipe_weight_poly),
        recipe_weight_oil_a: clearArray(prev.recipe_weight_oil_a),
        recipe_weight_oil_b: clearArray(prev.recipe_weight_oil_b),
        recipe_weight_chemical_PD: clearArray(prev.recipe_weight_chemical_PD),
        recipe_weight_silica: clearArray(prev.recipe_weight_silica),
        recipe_weight_filler: clearArray(prev.recipe_weight_filler),
      };
    });
  }


  // ------------------ Fetch Mixing Actions ------------------
  useEffect(() => {
    async function fetchActions() {
      setLoadingActions(true);
      setActionError(null);

      try {
        // Replace this URL with your real endpoint later
        const res = await fetch(`${apiUrl}/api/mixing-actions`);
        if (!res.ok) throw new Error("Failed to fetch mixing actions");
        const json = await res.json();
        setMixingActions(json.actions || []);
      } catch (err) {
        console.warn("Error loading actions. Using fallback.");
        setMixingActions(staticMixingActions); // fallback
        setActionError(err.message);
      } finally {
        setLoadingActions(false);
      }
    }

    // fetchActions();
  }, []);

  // ✅ NEW: Fetch materials whenever selectedMixer changes
  useEffect(() => {
    async function fetchMaterials() {
      if (!selectedMixer) return;

      try {
        const res = await api.get("/material/getMaterials/options", {
          params: { mixer: selectedMixer }
        });

        const json = res.data;

        if (json?.success && json?.data) {
          const { CB, PD, FL, Poly, Oil1, Oil2 } = json.data;

          setCbMaterialOptions(CB || []);
          setChemicalPDOptions(PD || []);
          setFillerOptions(FL || []);
          setPolyOptions(Poly || []);
          setOilAOptions(Oil1 || []);
          setOilBOptions(Oil2 || []);

          console.log(`✅ Materials loaded for ${selectedMixer}:`, json.data);
        } else {
          console.warn("Invalid material response:", json);
        }
      } catch (err) {
        console.error(`Failed to load materials for ${selectedMixer}:`, err);
      }
    }

    fetchMaterials();
  }, [selectedMixer]); // ✅ Dependency on selectedMixer

  // ------------------ Render Inputs ------------------
  function renderInput(val, onChange, key) {


    if (key.toLowerCase().includes("sheet_filter")) {
      const options = ["Enabled", "Disabled"]; // customize as needed
      return (
        <select value={val} onChange={(e) => onChange(e.target.value)}>
          <option value="">-- Select --</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }
    // Custom case for mix_action dropdown
    if (key === "mix_action") {
      const actions = mixingActions.length > 0 ? mixingActions : staticMixingActions;

      return (
        <select value={val} onChange={(e) => onChange(e.target.value)}>
          <option value="">-- Select Action --</option>
          {actions.map((action) => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
      );
    }
    if (key === "mix_condition") {
      return (
        <select value={val} onChange={(e) => onChange(e.target.value)}>
          <option value="">-- Select Condition --</option>
          {staticMixConditions.map((cond) => (
            <option key={cond} value={cond}>{cond}</option>
          ))}
        </select>
      );
    }

    if (key === "Act") {
      console.log("Rendering input for key:", key);

      const mixerOptions = [" ", "Weigh", "Weigh To", "Discharge"];
      return (
        <select value={val} onChange={(e) => onChange(e.target.value)}>
          <option value="">-- Select Mixer --</option>
          {mixerOptions.map((mixer) => (
            <option key={mixer} value={mixer}>{mixer}</option>

          ))}
        </select>
      );
    }




    const type = getInputType(key, val);

    if (type === "boolean") {
      return (
        <select value={val ? "1" : "0"} onChange={(e) => onChange(e.target.value === "1")}>
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>
      );
    }

    if (type === "datetime-local") {
      let formatted = "";
      if (val) {
        const d = new Date(val);
        if (!isNaN(d)) {
          formatted = d.toISOString().slice(0, 16);
        }
      }
      return <input type="datetime-local" value={formatted} onChange={(e) => onChange(e.target.value)} />;
    }

if (type === "checkbox-text") {
  return (
    <input
      type="checkbox"
      checked={Boolean(val)}
      onChange={(e) => onChange(e.target.checked)}
    />
  );
}


    return (
      <input
        type={type}
        value={val ?? ""}
        onChange={(e) => {
          let newVal = e.target.value;
          if (type === "number") newVal = parseFloat(newVal) || 0;
          onChange(newVal);
        }}
      />
    );
  }

  function materialKeys(obj) {
    if (!obj) return [];
    return Object.keys(obj).filter((k) => k.startsWith("recipe_weight_"));
  }

  // ------------------ Fetch Recipe ------------------
  async function fetchRecipe(e) {
    e?.preventDefault();
    if (!recipeId?.trim()) {
      setError("Please enter a Recipe ID");
      return;
    }

    setError(null);
    setLoading(true);
    setData(null);

    try {
      // const res = await fetch(`${apiUrl}/recipe/viewRecipe/byId`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ recipe_id: recipeId.trim() }),
      // });

      // if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      // const json = await res.json();

      const res = await api.post("/recipe/viewRecipe/byId", {
  recipe_id: recipeId.trim(),
});

const json = res.data;


      if (!json.data || !json.data.recipe_id) {
        setError(`No recipe found for ID "${recipeId}"`);
        return;
      }

      const recipeData = {
        recipe_weighing: json.data.recipe_weighing?.[0] || {},
        recipe_mixing: json.data.recipe_mixing || [],
        recipe_weight_CB: json.data.recipe_weight_CB || [],
        recipe_weight_poly: json.data.recipe_weight_poly || [],
        recipe_weight_oil_a: json.data.recipe_weight_oil_a || [],
        recipe_weight_oil_b: json.data.recipe_weight_oil_b || [],
        recipe_weight_chemical_PD: json.data.recipe_weight_PD || [],
        recipe_weight_silica: json.data.recipe_weight_silica || [],
        recipe_weight_filler: json.data.recipe_weight_filler || [],
        recipe_id: json.data.recipe_id,
      };

      setData(recipeData);
      setOriginalData(JSON.parse(JSON.stringify(recipeData)));
    } catch (err) {
      setError("Failed to fetch recipe: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // async function saveChanges() {
  //   confirm("Are You Sure Want To Save Changes")
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const payload = { recipe: data };
  //     console.log("🟢 Payload that would be sent to backend:");
  //     console.log(JSON.stringify(payload, null, 2));

  //     const response = await fetch(`${apiUrl}/recipe/editRecipe/byId`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!response.ok) throw new Error(`Failed to save changes: ${response.statusText}`);

  //     const result = await response.json(); // ✅ Only call this once
  //     console.log("Save success:", result);

  //     setOriginalData(JSON.parse(JSON.stringify(data)));
  //     setIsEditing(false);
  //   } catch (err) {
  //     setError(err.message || "Failed to process changes");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // async function saveChanges() {
  //   // Show confirmation dialog and store the result
  //   const userConfirmed = confirm("Are You Sure Want To Save Changes");

  //   // If user clicks Cancel, just return early, do nothing
  //   if (!userConfirmed) {
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const payload = { recipe: data };
  //     console.log("🟢 Payload that would be sent to backend:");
  //     console.log(JSON.stringify(payload, null, 2));

  //     const response = await fetch(`${apiUrl}/recipe/editRecipe/byId`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!response.ok) throw new Error(`Failed to save changes: ${response.statusText}`);

  //     const result = await response.json(); // ✅ Only call this once
  //     console.log("Save success:", result);

  //     setOriginalData(JSON.parse(JSON.stringify(data)));
  //     setIsEditing(false);
  //   } catch (err) {
  //     setError(err.message || "Failed to process changes");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

async function saveChanges() {
  const userConfirmed = confirm("Are You Sure Want To Save Changes");
  if (!userConfirmed) return;

  setLoading(true);
  setError(null);

  try {
    // 🧹 Clean up data before sending
    const cleanedData = { ...data };

    // 1️⃣ Filter invalid POLY entries (no material name or code)
    cleanedData.recipe_weight_poly = (data.recipe_weight_poly || []).filter(
      item => item.POLY_materialName?.trim() && item.POLY_materialCode?.trim()
    );

    // 2️⃣ (optional) Filter other materials too if needed:
    cleanedData.recipe_weight_CB = (data.recipe_weight_CB || []).filter(
      item => item.CB_materialName?.trim() && item.CB_materialCode?.trim()
    );
    cleanedData.recipe_weight_oil_a = (data.recipe_weight_oil_a || []).filter(
      item => item.OIL_A_materialName?.trim() && item.OIL_A_materialCode?.trim()
    );
    cleanedData.recipe_weight_oil_b = (data.recipe_weight_oil_b || []).filter(
      item => item.OIL_B_materialName?.trim() && item.OIL_B_materialCode?.trim()
    );
    cleanedData.recipe_weight_chemical_PD = (data.recipe_weight_chemical_PD || []).filter(
      item => item.PD_materialName?.trim() && item.PD_materialCode?.trim()
    );
    cleanedData.recipe_weight_filler = (data.recipe_weight_filler || []).filter(
      item => item.FL_materialName?.trim() && item.FL_materialCode?.trim()
    );
    cleanedData.recipe_weight_silica = (data.recipe_weight_silica || []).filter(
      item => item.SI_materialName?.trim() && item.SI_materialCode?.trim()
    );

    const payload = { recipe: cleanedData };

    console.log("🟢 Payload that would be sent to backend (cleaned):");
    console.log(JSON.stringify(payload, null, 2));

    // const response = await fetch(`${apiUrl}/recipe/editRecipe/byId`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });

    // if (!response.ok) throw new Error(`Failed to save changes: ${response.statusText}`);

    // const result = await response.json();

    const response = await api.post(
  "/recipe/editRecipe/byId",
  payload
);

const result = response.data;

    console.log("Save success:", result);

    setOriginalData(JSON.parse(JSON.stringify(cleanedData)));
    setIsEditing(false);
  } catch (err) {
    setError(err.message || "Failed to process changes");
  } finally {
    setLoading(false);
  }
}


  function cancelEdit() {
    setData(JSON.parse(JSON.stringify(originalData)));
    setIsEditing(false);
  }

  // ------------------ Render Sections ------------------
  function renderRecipeDetails(weigh) {
    if (!weigh) return null;

    const tmpKeys = new Set([
      "RotorTMP", "RotorTMPMinTol", "RotorTMPMaxTol",
      "DischargeDoorTMP", "DischargeDoorTMPMinTol", "DischargeDoorTMPMaxTol",
      "MixRoomTMP", "MixRoomTMPMinTol", "MixRoomTMPMaxTol",
    ]);

    const filteredKeys = Object.keys(weigh).filter((k) => !tmpKeys.has(k));

    return (
      <div className="details-block">
        <div className="details-title">Recipe Details</div>
        <div className="details-grid">
          {filteredKeys.map((k) => (
            <div className="detail-cell" key={k}>
              <div className="detail-label">{humanizeKey(k)}</div>
              <div className="detail-value">
                {isEditing
                  ? renderInput(weigh[k], (newVal) =>
                    setData((prev) => ({
                      ...prev,
                      recipe_weighing: { ...prev.recipe_weighing, [k]: newVal },
                    })), k)
                  : formatValue(k, weigh[k])}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderTMPBlock(weigh) {
    if (!weigh) return null;

    const tmpKeys = [
      "RotorTMP", "RotorTMPMinTol", "RotorTMPMaxTol",
      "DischargeDoorTMP", "DischargeDoorTMPMinTol", "DischargeDoorTMPMaxTol",
      "MixRoomTMP", "MixRoomTMPMinTol", "MixRoomTMPMaxTol",
    ];

    return (
      <div className="tmp-block">
        <div className="details-title">TCU Parameters</div>
        <div className="para"><div className="parameter1"><div className="column" style={{ visibility: "hidden" }}>-</div>
          <div className="column">Rotor TMP</div>
          <div className="column">Discharge Door TMP</div>
          <div className="column">Mix Room TMP</div></div>
          <div className="parameters">
            <div className="tmp-titles"><div className="tmp" style={{ visibility: "hidden" }}>-</div>
              <div className="tmp">Min Tol-</div>
              <div className="tmp">Max Tol +</div>

            </div>
            <div className="details-grid second-grid">
              {tmpKeys.map((k) => (
                <div className="detail-cell" key={k}>
                  <div className="detail-label">{humanizeKey(k)}</div>
                  <div className="detail-value">
                    {isEditing
                      ? renderInput(weigh[k], (newVal) =>
                        setData((prev) => ({
                          ...prev,
                          recipe_weighing: { ...prev.recipe_weighing, [k]: newVal },
                        })), k)
                      : formatValue(k, weigh[k])}
                  </div>
                </div>
              ))}
            </div>
          </div></div>


      </div>
    );
  }

  // function renderMixTable(mix) {
  //   if (!Array.isArray(mix)) return null;
  //   const headers = Array.from(new Set(mix.flatMap((row) => Object.keys(row))));

  //   function addNewMixRow() {
  //     const newRow = {};
  //     headers.forEach((h) => (newRow[h] = ""));

  //     // Detect the column that corresponds to "Mix Seq No"
  //     const mixSeqKey = headers.find(
  //       (h) => h.toLowerCase().replace(/\s|_/g, "") === "mixseqno"
  //     );

  //     if (mixSeqKey) {
  //       const lastRow = data.recipe_mixing[data.recipe_mixing.length - 1];
  //       const lastVal = lastRow?.[mixSeqKey];
  //       const nextVal = !isNaN(parseInt(lastVal)) ? parseInt(lastVal) + 1 : 1;
  //       newRow[mixSeqKey] = nextVal;
  //     }

  //     setData((prev) => ({
  //       ...prev,
  //       recipe_mixing: [...prev.recipe_mixing, newRow],
  //     }));
  //   }


  //   return (
  //     <div className="mix-block">
  //       <div className="section-title">
  //         Mix Sequence
  //         {isEditing && (
  //           <button className="btn small" onClick={addNewMixRow} style={{ marginLeft: "1rem" }}>
  //             + Add New
  //           </button>
  //         )}
  //       </div>
  //       <table className="mix-table">
  //         <thead>
  //           <tr>{headers.map((h) => <th key={h}>{humanizeKey(h)}</th>)}</tr>
  //         </thead>
  //         <tbody>
  //           {mix.map((row, i) => (
  //             <tr key={i}>
  //               {headers.map((h) => (
  //                 <td key={h + i}>
  //                   {isEditing
  //                     ? renderInput(row[h], (newVal) => {
  //                       const copy = { ...data };
  //                       copy.recipe_mixing = [...copy.recipe_mixing];
  //                       copy.recipe_mixing[i] = { ...copy.recipe_mixing[i], [h]: newVal };

  //                       setData(copy);
  //                     }, h)
  //                     : formatValue(h, row[h])}
  //                 </td>
  //               ))}
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  // }


  // function renderMaterialTable(key, arr) {
  //   if (!Array.isArray(arr)) return null;
  //   const headers = arr.length > 0 ? Object.keys(arr[0]) : ["material_name", "weight"];

  //   function addNewMaterialRow() {
  //     const newRow = {};
  //     const lastRow = data[key][data[key].length - 1];

  //     headers.forEach((h) => {
  //       // Check if it's an index field (e.g., ends in "Index")
  //       if (h.toLowerCase().includes("index")) {
  //         const lastVal = lastRow?.[h];
  //         const nextIndex = !isNaN(parseInt(lastVal)) ? parseInt(lastVal) + 1 : 1;
  //         newRow[h] = nextIndex;
  //       } else {
  //         newRow[h] = "";
  //       }
  //     });

  //     setData((prev) => ({
  //       ...prev,
  //       [key]: [...prev[key], newRow],
  //     }));
  //   }


  //   const title = key.replace("recipe_weight_", "").replace(/_/g, " ").toUpperCase();

  //   return (
  //     <div className="material-card" key={key}>
  //       <div className="material-title">
  //         {title}
  //         {isEditing && (
  //           <button className="btn small" onClick={addNewMaterialRow} style={{ marginLeft: "1rem" }}>
  //             + Add
  //           </button>
  //         )}
  //       </div>
  //       <table className="material-table">
  //         <thead>
  //           <tr>{headers.map((h) => <th key={h}>{humanizeKey(h)}</th>)}</tr>
  //         </thead>
  //         <tbody>
  //           {arr.map((r, idx) => (
  //             <tr key={idx}>
  //               {headers.map((h) => (
  //                 <td key={h + idx}>
  //                   {isEditing
  //                     ? renderInput(r[h], (newVal) => {
  //                       const copy = { ...data };
  //                       copy[key] = [...copy[key]];
  //                       copy[key][idx] = { ...copy[key][idx], [h]: newVal };
  //                       setData(copy);
  //                     }, h)
  //                     : formatValue(h, r[h])}
  //                 </td>
  //               ))}
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  // }


  // ------------------ Render JSX ------------------

  function renderMixTable(mix) {
    if (!Array.isArray(mix)) return null;
    const headers = Array.from(new Set(mix.flatMap((row) => Object.keys(row))));

    function addNewMixRow() {
      const newRow = {};
      headers.forEach((h) => (newRow[h] = ""));

      const mixSeqKey = headers.find(
        (h) => h.toLowerCase().replace(/\s|_/g, "") === "mixseqno"
      );

      if (mixSeqKey) {
        const lastRow = data.recipe_mixing[data.recipe_mixing.length - 1];
        const lastVal = lastRow?.[mixSeqKey];
        const nextVal = !isNaN(parseInt(lastVal)) ? parseInt(lastVal) + 1 : 1;
        newRow[mixSeqKey] = nextVal;
      }

      setData((prev) => ({
        ...prev,
        recipe_mixing: [...prev.recipe_mixing, newRow],
      }));
    }

    function removeLastMixRow() {
      setData((prev) => ({
        ...prev,
        recipe_mixing: prev.recipe_mixing.slice(0, -1),
      }));
    }

    return (
      <div className="mix-block">
        <div className="section-title">
          Mix Sequence
          {isEditing && (
            <div style={{ display: "flex" }}>
              <button className="btn small" onClick={addNewMixRow}>
                + Add New
              </button>
              <button
                className="btn small"
                onClick={removeLastMixRow}
                disabled={mix.length <= 1}
                style={{ backgroundColor: "#ff5959", color: "white", borderLeft: "1px solid white" }}
              >
                - Remove Last
              </button>
            </div>
          )}

        </div>
        <table className="mix-table">
          <thead>
            <tr>{headers.map((h) => <th key={h}>{humanizeKey(h)}</th>)}</tr>
          </thead>
          <tbody>
            {mix.map((row, i) => (
              <tr key={i}>
                {headers.map((h) => (
                  <td key={h + i}>
                    {isEditing
                      ? renderInput(row[h], (newVal) => {
                        const copy = { ...data };
                        copy.recipe_mixing = [...copy.recipe_mixing];
                        copy.recipe_mixing[i] = { ...copy.recipe_mixing[i], [h]: newVal };
                        setData(copy);
                      }, h)
                      : formatValue(h, row[h])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }


  function renderMaterialTable(key, arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  let headers = arr.length > 0 ? Object.keys(arr[0]) : ["material_name", "weight"];

  if (key === "recipe_weight_poly") {
    const sheetFilterKey = headers.find(h => h.toLowerCase().includes("sheet_filter"));
    if (sheetFilterKey) {
      headers = headers.filter(h => h !== sheetFilterKey);
      headers.push(sheetFilterKey);
    }
  }

  function addNewMaterialRow() {
    const newRow = {};
    const lastRow = data[key][data[key].length - 1];
    headers.forEach((h) => {
      if (h.toLowerCase().includes("index")) {
        const lastVal = lastRow?.[h];
        const nextIndex = !isNaN(parseInt(lastVal)) ? parseInt(lastVal) + 1 : 1;
        newRow[h] = nextIndex;
      } else {
        newRow[h] = "";
      }
    });
    setData((prev) => ({
      ...prev,
      [key]: [...prev[key], newRow],
    }));
  }

  function removeLastMaterialRow() {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].slice(0, -1),
    }));
  }

  // Title formatting
  let title = key.replace("recipe_weight_", "").replace(/_/g, " ").toUpperCase();
  if (title === "CHEMICAL PD") title = "PD";
  if (title === "FILLER") title = "FL";

  // Get corresponding material options
  let materialOptions = [];
  let nameKey = "";
  let codeKey = "";

  switch (key) {
    case "recipe_weight_poly":
      materialOptions = polyOptions;
      nameKey = "POLY_materialName";
      codeKey = "POLY_materialCode";
      break;
    case "recipe_weight_CB":
      materialOptions = cbMaterialOptions;
      nameKey = "CB_materialName";
      codeKey = "CB_materialCode";
      break;
    case "recipe_weight_chemical_PD":
      materialOptions = chemicalPDOptions;
      nameKey = "PD_materialName";
      codeKey = "PD_materialCode";
      break;
    case "recipe_weight_filler":
      materialOptions = fillerOptions;
      nameKey = "FL_materialName";
      codeKey = "FL_materialCode";
      break;
    case "recipe_weight_oil_a":
      materialOptions = oilAOptions;
      nameKey = "OIL_A_materialName";
      codeKey = "OIL_A_materialCode";
      break;
    case "recipe_weight_oil_b":
      materialOptions = oilBOptions;
      nameKey = "OIL_B_materialName";
      codeKey = "OIL_B_materialCode";
      break;
    default:
      break;
  }

  return (
    <div className="material-card" key={key}>
      <div className="material-title">
        {title}
        {isEditing && (
          <div style={{ display: "flex" }}>
            <button className="btn small" onClick={addNewMaterialRow}>
              + Add
            </button>
            <button
              className="btn small"
              onClick={removeLastMaterialRow}
              disabled={arr.length <= 1}
              style={{ backgroundColor: "#ff5959", color: "white", borderLeft: "1px solid white" }}
            >
              - Remove Last
            </button>
          </div>
        )}
      </div>

      <table className="material-table">
        <thead>
          <tr>{headers.map((h) => <th key={h}>{humanizeKey(h)}</th>)}</tr>
        </thead>
        <tbody>
          {arr.map((r, idx) => (
            <tr key={idx}>
              {headers.map((h) => (
                <td key={h + idx}>
                  {/* Check if this field is a Material Name */}
                  {isEditing && h === nameKey ? (
                    <select
                      value={r[h] || ""}
                      onChange={(e) => {
                        const selectedName = e.target.value;
                        const selected = materialOptions.find((m) => m.name === selectedName);
                        const copy = { ...data };
                        copy[key] = [...copy[key]];
                        copy[key][idx] = {
                          ...copy[key][idx],
                          [h]: selectedName,
                          [codeKey]: selected ? selected.code : "",
                        };
                        setData(copy);
                      }}
                    >
                      <option value="">-- Select Material --</option>
                      {materialOptions.map((m) => (
                        <option key={m.code} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  ) : isEditing && h === codeKey ? (
                    <input type="text" value={r[h] || ""} readOnly />
                  ) : isEditing ? (
                    renderInput(r[h], (newVal) => {
                      const copy = { ...data };
                      copy[key] = [...copy[key]];
                      copy[key][idx] = { ...copy[key][idx], [h]: newVal };
                      setData(copy);
                    }, h)
                  ) : (
                    formatValue(h, r[h])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


const [recipeList, setRecipeList] = useState([]);

useEffect(() => {
  async function fetchRecipeList() {
    try {
      // const res = await fetch(`${apiUrl}/recipe/allRecipeIds`);
      // const json = await res.json();
      const res = await api.get("/recipe/allRecipeIds");
const json = res.data;

      if (json?.data?.recipe_ids) {
        setRecipeList(json.data.recipe_ids);
      }
    } catch (err) {
      console.error("Error fetching recipe IDs:", err);
    }
  }
  fetchRecipeList();
}, []);

  return (
    <div className="page-root">
      <header className="page-header">
        <h1>Recipe</h1>

        <div className="controls">
          {/* <form onSubmit={fetchRecipe} className="search-form">
            <input
              value={recipeId}
              onChange={(e) => setRecipeId(e.target.value)}
              placeholder="Enter Recipe ID (e.g. MTR0076)"
              className="recipe-input"
            />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Loading..." : "Fetch"}
            </button>

            {data && !isEditing && (
              <button type="button" className="btn outline" onClick={() => setIsEditing(true)}>
                Edit
              </button>
            )}

            {data && isEditing && (
              <>
                <button type="button" className="btn" onClick={saveChanges}>Save Changes</button>
                <button type="button" className="btn outline" onClick={cancelEdit}>Cancel</button>
              </>
            )}

            <button type="button" className="btn outline" style={{ backgroundColor: "#ea4949", color: "#ffff", border: "none" }} onClick={() => { navigate("/delete-recipe") }}>
              Delete Recipe
            </button>
            <button type="button" className="btn outline" style={{ backgroundColor: "#3919acff", color: "#ffff", border: "none" }} onClick={() => { navigate("/copy-recipe") }}>
              Copy Recipe
            </button>
          </form> */}

          <form onSubmit={fetchRecipe} className="search-form">
  {/* Dropdown before input */}
  <select
    value={recipeId}
    onChange={(e) => setRecipeId(e.target.value)}
    className="recipe-dropdown"
  >
    <option value="">-- Select Recipe ID --</option>
    {recipeList.map((id) => (
      <option key={id} value={id}>{id}</option>
    ))}
  </select>

  {/* Existing input field */}
  <input
    value={recipeId}
    onChange={(e) => setRecipeId(e.target.value)}
    placeholder="Enter Recipe ID (e.g. MTR0076)"
    className="recipe-input"
  />

  <button type="submit" className="btn" disabled={loading}>
    {loading ? "Loading..." : "Fetch"}
  </button>

  {data && !isEditing && (
    <button type="button" className="btn outline" onClick={() => setIsEditing(true)}>
      Edit
    </button>
  )}

  {data && isEditing && (
    <>
      <button type="button" className="btn" onClick={saveChanges}>Save Changes</button>
      <button type="button" className="btn outline" onClick={cancelEdit}>Cancel</button>
    </>
  )}

  <button
    type="button"
    className="btn outline"
    style={{ backgroundColor: "#ea4949", color: "#ffff", border: "none" }}
    onClick={() => navigate("/delete-recipe")}
  >
    Delete
  </button>
  <button
    type="button"
    className="btn outline"
    style={{ backgroundColor: "#3919acff", color: "#ffff", border: "none" }}
    onClick={() => navigate("/copy-recipe")}
  >
    Copy
  </button>
</form>

          <div className="add-new-recipe ">
            <button className="btn" onClick={() => {
              clearDataValues();
              setTimeout(() => {
                navigate("/add-edit-recipe");
              }, 100); // 100ms delay to allow state to update
            }}>
              Add New Recipe
            </button>

          </div>

          {error && <div className="error">{error}</div>}
        </div>
      </header>

      <main className="report-area">
        {!data && <div className="placeholder">Enter Recipe ID and click Fetch to load report.</div>}

        {data && (
          <div className="report-card">
            <div className="side-by-side-details">
              {renderRecipeDetails(data.recipe_weighing)}
              {renderTMPBlock(data.recipe_weighing)}
            </div>

            <div className="side-by-side-container">
              <div className="materials-section">
                <div className="section-title">Materials</div>
                <div
                  className="materials-grid"
                  style={{
                    gridTemplateColumns: "repeat(1, 1fr)",
                    gap: isEditing ? "10px" : "20px",
                    display: "grid",
                  }}
                >
                  {[
                    "recipe_weight_CB",
                    "recipe_weight_chemical_PD",
                    "recipe_weight_filler",
                    "recipe_weight_poly",
                    "recipe_weight_oil_a",
                    "recipe_weight_oil_b"
                  ].map((mk) => renderMaterialTable(mk, data[mk]))}

                </div>
              </div>
              {renderMixTable(data.recipe_mixing)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}



