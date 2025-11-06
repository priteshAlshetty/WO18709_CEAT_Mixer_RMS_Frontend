// AddRecipeFromTemplate.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RecipePage.css";
import recipeTemplate from "../data/dummydata.json";
import {
  cbMaterialOptions,
  chemicalPDOptions,
  fillerOptions,
  polyOptions,
  oilAOptions,
  oilBOptions,
} from "../Constants/Material";


const apiUrl = import.meta.env.VITE_API_URL;

const staticMixingActions = [
    " ", // Represents the null/empty option
    "Add Poly",
    "keeping",
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
    "Tem And Energy",
    "(Time Or Temp)And EG",
    "(Time Or EG)And Temp",
    "(Temp Or EG)And Time"
];


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


function getInputType(key, value) {
    const lowerKey = key.toLowerCase();
    const normalizedKey = lowerKey.replace(/[^a-z]/g, "");
    const checkboxTextFields = new Set(["usethreetmp", "cbreclaim", "usingstatus"]);

    // if (checkboxTextFields.has(normalizedKey)) return "checkbox-text";
    if (checkboxTextFields.has(normalizedKey)) return "checkbox-number";

    if (typeof value === "number") return "number";
    if (typeof value === "boolean" || lowerKey.includes("status") || lowerKey.includes("activate")) return "boolean";
    return "text";
}

export default function AddRecipeFromTemplate() {
    const [data, setData] = useState(null);
    const [mixingActions, setMixingActions] = useState([]);
    const [error, setError] = useState(null);
    const [cleared, setCleared] = useState(false);
    const navigate = useNavigate();

    // Load template data on mount
    useEffect(() => {
        setData(recipeTemplate);
    }, []);

    // Clear initial values only once
    useEffect(() => {
        if (data && !cleared) {
            clearDataValues();
            setCleared(true);
        }
    }, [data, cleared]);

    // function cleanMaterialArray(arr, nameKey, codeKey) {
    //     if (!Array.isArray(arr)) return [];
    //     return arr.filter(item => {
    //         const name = item[nameKey]?.toString().trim();
    //         const code = item[codeKey]?.toString().trim();
    //         return name !== "" && name !== "0" && code !== "" && code !== "0";
    //     });
    // }
    function cleanMaterialArray(arr) {
        if (!Array.isArray(arr)) return [];
        return arr.filter(item => {
            const act = item.Act?.toString().trim();
            return act && act !== "" && act !== " " && act !== "0";
        });
    }

    const saveNewRecipe = async () => {
        // Clean up all the material arrays before sending
        const cleanedData = {
            ...data,
            recipe_id: data.recipe_weighing.recipe_id || data.recipe_id,
            recipe_weight_CB: cleanMaterialArray(data.recipe_weight_CB, "CB_materialName", "CB_materialCode"),
            recipe_weight_poly: cleanMaterialArray(data.recipe_weight_poly, "POLY_materialName", "POLY_materialCode"),
            recipe_weight_oil_a: cleanMaterialArray(data.recipe_weight_oil_a, "OIL_A_materialName", "OIL_A_materialCode"),
            recipe_weight_oil_b: cleanMaterialArray(data.recipe_weight_oil_b, "OIL_B_materialName", "OIL_B_materialCode"),
            recipe_weight_chemical_PD: cleanMaterialArray(data.recipe_weight_chemical_PD, "PD_materialName", "PD_materialCode"),
            recipe_weight_filler: cleanMaterialArray(data.recipe_weight_filler, "FL_materialName", "FL_materialCode"),
        };

        const payload = {
            recipe: cleanedData
        };

        console.log("Sending payload:", JSON.stringify(payload, null, 2));

        try {
            const response = await fetch(`${apiUrl}/recipe/addNewRecipe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            console.log("Server response:", result);

            if (response.ok) {
                const confirmed = window.confirm("Are you sure you want to save this recipe?");
                if (!confirmed) return;

                window.alert("Recipe Saved Successfully");
                navigate("/");
            } else {
                setError(result?.message || "Error adding recipe");
                alert(result?.message);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Network error while adding recipe");
        }
    };

    function clearDataValues() {
        setData((prev) => {
            if (!prev) return prev;

            const clearedWeighing = {};
            for (const key in prev.recipe_weighing) {
                const val = prev.recipe_weighing[key];
                clearedWeighing[key] = typeof val === "boolean" ? false : (typeof val === "number" ? 0 : "");
            }

            function clearArray(arr) {
                if (!arr || !Array.isArray(arr)) return [];

                let seqCounter = 1;

                return arr.map((item) => {
                    const newItem = {};
                    for (const k in item) {
                        const v = item[k];
                        if (k.toLowerCase().includes("mix_seq_no")) {
                            newItem[k] = seqCounter++; // 👈 Auto-increment mix_seq_no
                        } else if (k.endsWith("_index")) {
                            newItem[k] = v;
                        } else {
                            newItem[k] = typeof v === "boolean" ? false : (typeof v === "number" ? 0 : "");
                        }
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
                // recipe_weight_silica: clearArray(prev.recipe_weight_silica),
                recipe_weight_filler: clearArray(prev.recipe_weight_filler),
            };
        });
    }

    function renderInput(val, onChange, key) {
        if (key.toLowerCase().includes("sheet_filter")) {
            const options = ["Enabled", "Disabled", " "]; // or whatever your valid values are
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



        if (key === "CB_materialName") {
            return (
                <select value={val} onChange={(e) => {
                    const selectedName = e.target.value;
                    const selected = cbMaterialOptions.find(opt => opt.name === selectedName);

                    // Find the index of this row
                    const index = data.recipe_weight_CB.findIndex(row => row[key] === val);

                    if (index === -1) return; // fallback if not found

                    setData(prev => {
                        const updatedCB = [...prev.recipe_weight_CB];
                        updatedCB[index] = {
                            ...updatedCB[index],
                            CB_materialName: selectedName,
                            CB_materialCode: selected?.code || ""
                        };
                        return { ...prev, recipe_weight_CB: updatedCB };
                    });
                }}>
                    <option value="">-- Select CB Material --</option>
                    {cbMaterialOptions.map(opt => (
                        <option key={opt.name} value={opt.name}>{opt.name}</option>
                    ))}
                </select>
            );
        }


        if (key === "PD_materialName") {
            return (
                <select
                    value={val}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        const selected = chemicalPDOptions.find(opt => opt.name === selectedName);

                        // Find row index by matching materialName
                        const index = data.recipe_weight_chemical_PD.findIndex(row => row[key] === val);
                        if (index === -1) return;

                        setData(prev => {
                            const updated = [...prev.recipe_weight_chemical_PD];
                            updated[index] = {
                                ...updated[index],
                                PD_materialName: selectedName,
                                PD_materialCode: selected?.code || ""
                            };
                            return { ...prev, recipe_weight_chemical_PD: updated };
                        });
                    }}
                >
                    <option value="">-- Select PD Material --</option>
                    {chemicalPDOptions.map(opt => (
                        <option key={opt.name} value={opt.name}>{opt.name}</option>
                    ))}
                </select>
            );
        }


        if (key === "FL_materialName") {
            return (
                <select
                    value={val}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        const selected = fillerOptions.find(opt => opt.name === selectedName);

                        const index = data.recipe_weight_filler.findIndex(row => row[key] === val);
                        if (index === -1) return;

                        setData(prev => {
                            const updated = [...prev.recipe_weight_filler];
                            updated[index] = {
                                ...updated[index],
                                FL_materialName: selectedName,
                                FL_materialCode: selected?.code || ""
                            };
                            return { ...prev, recipe_weight_filler: updated };
                        });
                    }}
                >
                    <option value="">-- Select FL Material --</option>
                    {fillerOptions.map(opt => (
                        <option key={opt.name} value={opt.name}>{opt.name}</option>
                    ))}
                </select>
            );
        }


        if (key === "POLY_materialName") {
            return (
                <select
                    value={val}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        const selected = polyOptions.find(opt => opt.name === selectedName);

                        // Find the index of this row
                        const index = data.recipe_weight_poly.findIndex(row => row[key] === val);
                        if (index === -1) return;

                        setData(prev => {
                            const updatedPoly = [...prev.recipe_weight_poly];
                            updatedPoly[index] = {
                                ...updatedPoly[index],
                                POLY_materialName: selectedName,
                                POLY_materialCode: selected?.code || ""
                            };
                            return { ...prev, recipe_weight_poly: updatedPoly };
                        });
                    }}
                >
                    <option value="">-- Select Poly Material --</option>
                    {polyOptions.map(opt => (
                        <option key={opt.name} value={opt.name}>{opt.name}</option>
                    ))}
                </select>
            );
        }


        if (key === "OIL_A_materialName") {
            return (
                <select
                    value={val}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        const selected = oilAOptions.find(opt => opt.name === selectedName);

                        const index = data.recipe_weight_oil_a.findIndex(row => row[key] === val);
                        if (index === -1) return;

                        setData(prev => {
                            const updated = [...prev.recipe_weight_oil_a];
                            updated[index] = {
                                ...updated[index],
                                OIL_A_materialName: selectedName,
                                OIL_A_materialCode: selected?.code || ""
                            };
                            return { ...prev, recipe_weight_oil_a: updated };
                        });
                    }}
                >
                    <option value="">-- Select Oil A Material --</option>
                    {oilAOptions.map(opt => (
                        <option key={opt.name} value={opt.name}>{opt.name}</option>
                    ))}
                </select>
            );
        }


        if (key === "OIL_B_materialName") {
            return (
                <select
                    value={val}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        const selected = oilBOptions.find(opt => opt.name === selectedName);

                        const index = data.recipe_weight_oil_b.findIndex(row => row[key] === val);
                        if (index === -1) return;

                        setData(prev => {
                            const updated = [...prev.recipe_weight_oil_b];
                            updated[index] = {
                                ...updated[index],
                                OIL_B_materialName: selectedName,
                                OIL_B_materialCode: selected?.code || ""
                            };
                            return { ...prev, recipe_weight_oil_b: updated };
                        });
                    }}
                >
                    <option value="">-- Select Oil B Material --</option>
                    {oilBOptions.map(opt => (
                        <option key={opt.name} value={opt.name}>{opt.name}</option>
                    ))}
                </select>
            );
        }



        if (key === "mix_action") {
            const actions = mixingActions.length > 0 ? mixingActions : staticMixingActions;
            return (
                <select value={val || ""} onChange={(e) => onChange(e.target.value)}>
                    <option value=""></option>
                    {actions.map((act) => <option key={act} value={act}>{act}</option>)}
                </select>
            );
        }
        if (key === "mix_condition") {
            return (
                <select value={val || ""} onChange={(e) => onChange(e.target.value)}>
                    <option value=""></option>
                    {staticMixConditions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
            );
        }
        if (key === "Act") {
            const mixerOpts = [" ", "Weigh", "Weigh To", "Discharge"];
            return (
                <select value={val || ""} onChange={(e) => onChange(e.target.value)}>
                    <option value="">-- Select Mixer --</option>
                    {mixerOpts.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
            );
        }
        if (key === "Sheet_Filter") {
            const mixerOpts = ["Enabled", "Disabled"];
            return (
                <select value={val || ""} onChange={(e) => onChange(e.target.value)}>
                    <option value="">-- Select Mixer --</option>
                    {mixerOpts.map((m) => <option key={m} value={m}>{m}</option>)}
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

if (type === "checkbox-number") {
    return (
        <input
            type="checkbox"
            checked={!!val} // force boolean
            onChange={(e) => onChange(e.target.checked)} // directly store true/false
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

    function renderRecipeDetails(weigh) {
        if (!weigh) return null;
        return (
            <div className="details-block">
                <div className="details-title">Recipe Details</div>
                <div className="details-grid">
                    {Object.keys(weigh)
                        .filter((k) => ![
                            "RotorTMP", "RotorTMPMinTol", "RotorTMPMaxTol",
                            "DischargeDoorTMP", "DischargeDoorTMPMinTol", "DischargeDoorTMPMaxTol",
                            "MixRoomTMP", "MixRoomTMPMinTol", "MixRoomTMPMaxTol"
                        ].includes(k))
                        .map((k) => (
                            <div className="detail-cell" key={k}>
                                <div className="detail-label">{humanizeKey(k)}</div>
                                <div className="detail-value">
                                    {renderInput(weigh[k], (val) => {
                                        setData((prev) => ({
                                            ...prev,
                                            recipe_weighing: { ...prev.recipe_weighing, [k]: val }
                                        }));
                                    }, k)}
                                </div>
                            </div>
                        ))}

                </div>
            </div>
        );
    }

    function renderTMPBlock(weigh) {
        const tmpKeys = [
            "RotorTMP", "RotorTMPMinTol", "RotorTMPMaxTol",
            "DischargeDoorTMP", "DischargeDoorTMPMinTol", "DischargeDoorTMPMaxTol",
            "MixRoomTMP", "MixRoomTMPMinTol", "MixRoomTMPMaxTol",
        ];
        return (
            <div className="tmp-block">
                <div className="details-title">TCU Parameters</div>
                <div className="para">
                    <div className="parameter1">
                        <div className="column" style={{ visibility: "hidden" }}>-</div>
                        <div className="column">Rotor TMP</div>
                        <div className="column">Discharge Door TMP</div>
                        <div className="column">Mix Room TMP</div>
                    </div>
                    <div className="parameters">
                        <div className="tmp-titles">
                            <div className="tmp" style={{ visibility: "hidden" }}>-</div>
                            <div className="tmp">Min Tol-</div>
                            <div className="tmp">Max Tol +</div>
                        </div>
                        <div className="details-grid second-grid">
                            {tmpKeys.map((k) => (
                                <div className="detail-cell" key={k}>
                                    <div className="detail-label">{humanizeKey(k)}</div>
                                    <div className="detail-value">
                                        {renderInput(weigh[k], (val) => {
                                            setData((prev) => ({
                                                ...prev,
                                                recipe_weighing: { ...prev.recipe_weighing, [k]: val },
                                            }));
                                        }, k)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        );
    }


    function renderMixTable(mixArr) {
        if (!Array.isArray(mixArr)) return null;
        const headers = Array.from(new Set(mixArr.flatMap((r) => Object.keys(r))));

        function addRow() {
            const newRow = {};
            headers.forEach((h) => newRow[h] = "");

            const seqKey = headers.find((h) => h.toLowerCase().includes("mix_seq_no"));

            if (seqKey) {
                const maxSeq = mixArr.reduce((max, row) => {
                    const val = parseInt(row[seqKey], 10);
                    return isNaN(val) ? max : Math.max(max, val);
                }, 0);
                newRow[seqKey] = maxSeq + 1;
            }

            setData((prev) => ({
                ...prev,
                recipe_mixing: [...prev.recipe_mixing, newRow]
            }));
        }


        function deleteLastRow() {
            if (mixArr.length <= 1) return; // Keep at least one row
            const updated = mixArr.slice(0, -1); // remove last row
            setData((prev) => ({ ...prev, recipe_mixing: updated }));
        }

        return (
            <div className="mix-block">
                <div
                    className="section-title"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span>Mix Sequence</span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn small" onClick={addRow}>+ Add New</button>
                        <button className="btn small danger" onClick={deleteLastRow}>- Delete</button>
                    </div>
                </div>

                <table className="mix-table">
                    <thead>
                        <tr>
                            {headers.map((h) => <th key={h}>{humanizeKey(h)}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {mixArr.map((row, i) => (
                            <tr key={i}>
                                {headers.map((h) => (
                                    <td key={h + i}>
                                        {h.toLowerCase() === "mix_seq_no" ? (
                                            <span>{row[h]}</span> // Read-only
                                        ) : (
                                            renderInput(row[h], (val) => {
                                                const updated = [...data.recipe_mixing];
                                                updated[i] = { ...updated[i], [h]: val };
                                                setData((prev) => ({ ...prev, recipe_mixing: updated }));
                                            }, h)
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


    function renderMaterialTable(key, arr) {
        if (!Array.isArray(arr)) return null;
        let headers = arr.length > 0 ? Object.keys(arr[0]) : ["material_name", "weight"];

        // Move "Sheet Filter" to the end if this is the POLY table
        if (key === "recipe_weight_poly") {
            const sheetFilterKey = headers.find(h => h.toLowerCase().includes("sheet_filter")); // Adjust if exact match is needed
            if (sheetFilterKey) {
                headers = headers.filter(h => h !== sheetFilterKey);
                headers.push(sheetFilterKey);
            }
        }


        function addRow() {
            const newRow = {};
            headers.forEach((h) => {
                newRow[h] = h.toLowerCase().includes("index")
                    ? (arr[arr.length - 1]?.[h] || 0) + 1
                    : "";
            });
            setData((prev) => ({ ...prev, [key]: [...prev[key], newRow] }));
        }

        function deleteLastRow() {
            if (arr.length <= 1) return; // Keep at least one row
            const updated = arr.slice(0, -1);
            setData((prev) => ({ ...prev, [key]: updated }));
        }

        return (
            <div className="material-card" key={key}>
                <div className="material-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>
  {(() => {
    const name = key.replace("recipe_weight_", "").toUpperCase();
    if (name === "CHEMICAL_PD") return "PD";
    if (name === "FILLER") return "FL";
    return name;
  })()}
</span>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn small" onClick={addRow}>+ Add</button>
                        <button className="btn small danger" onClick={deleteLastRow}>- Delete</button>
                    </div>
                </div>
                <table className="material-table">
                    <thead>
                        <tr>{headers.map((h) => <th key={h}>{humanizeKey(h)}</th>)}</tr>
                    </thead>
                    <tbody>
                        {arr.map((row, i) => (
                            <tr key={i}>
                                {headers.map((h) => (
                                    <td key={h + i}>
                                        {renderInput(row[h], (val) => {
                                            const copy = [...arr];
                                            copy[i] = { ...copy[i], [h]: val };
                                            setData((prev) => ({ ...prev, [key]: copy }));
                                        }, h)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (!data) return <div>Loading template...</div>;

    return (
        <div className="page-root">
            <header className="page-header">
                <h1>Create Recipe from Template</h1>
                <div className="controls">
                    <button className="btn" onClick={saveNewRecipe}>Save New Recipe</button>
                    <button className="btn outline" onClick={() => navigate("/")}>Cancel</button>
                    <button className="btn outline" onClick={clearDataValues}>Clear Form Data</button>
                    {error && <div className="error">{error}</div>}
                </div>
            </header>

            <main className="report-area">
                <div className="report-card">
                    <div className="side-by-side-details">
                        {renderRecipeDetails(data.recipe_weighing)}
                        {renderTMPBlock(data.recipe_weighing)}
                    </div>

                    <div className="materials-and-mix-section" style={{ display: "flex" }}>
                        <div className="materials-section">
                            <div className="materials-grid" style={{ gridTemplateColumns: "repeat(1, 1fr)" }}>
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
            </main>
        </div>
    );
}
