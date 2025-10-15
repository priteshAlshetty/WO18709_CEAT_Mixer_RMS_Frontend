// AddRecipeFromTemplate.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RecipePage.css";
import recipeTemplate from "../data/dummydata.json";

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


// Mateial Name And Code--------------------------------
const cbMaterialOptions = [
  { name: "CB1-N330", code: "N330" },
  { name: "CB2-N326", code: "N326" },
  { name: "CB3-N220", code: "N220" },
  { name: "CB4-N339", code: "N339" },
  { name: "CB5-N660", code: "N660" },
  { name: "CB6", code: "CB6" }
];

const chemicalPDOptions = [
  { name: "R729", code: "R729" },
  { name: "R729G", code: "Silica" }
];

const fillerOptions = [
  { name: "CBM1MS272", code: "CBM1MS272" },
  { name: "DELAYCHEMICAL", code: "DELAYCHEMICAL" },
  { name: "masteringredient", code: "masterchemicl" },
  { name: "CBM1MS382G", code: "CBM1MS382G" }
];


const polyOptions = [
  { name: "B2301", code: "B2301" },
  { name: "BLOCKRUBBER1", code: "TSR10" },
  { name: "BR-RUBBER", code: "R2322E" },
  { name: "CARBON", code: "CARBON" },
  { name: "CBM1B0121", code: "CBM1B0121" },
  { name: "CBM1B0124", code: "CBM1B0124" },
  { name: "CBM1MB0131", code: "CBM1MB0131" },
  { name: "CBM1MB0761", code: "CBM1MB0761" },
  { name: "CBM1MG011", code: "CBM1MG011" },
  { name: "CBM1MK051", code: "CBM1MK051" },
  { name: "CBM1MK083", code: "CBM1MK083" },
  { name: "CBM1MK241", code: "CBM1MK241" },
  { name: "CBM1MK391", code: "CBM1MK391" },
  { name: "CBM1MK491", code: "CBM1MK491" },
  { name: "CBM1ML611", code: "CBM1ML611" },
  { name: "CBM1MS271", code: "CBM1MS271" },
  { name: "CBM1MS461", code: "CBM1MS461" },
  { name: "CBM1MS531", code: "CBM1MS531" },
  { name: "CBM1MT021", code: "CBM1MT021" },
  { name: "CBM1MT0431", code: "CBM1MT0431" },
  { name: "CBM1MT0441", code: "CBM1MT0441" },
  { name: "CBM1MT411", code: "CBM1MT411" },
  { name: "CBM1MT421", code: "CBM1MT421" },
  { name: "CBM1MT581", code: "CBM1MT581" },
  { name: "CBM1MT671", code: "CBM1MT671" },
  { name: "CBM1MW321", code: "CBM1MW321" },
  { name: "CHEMICAL", code: "MASTERCHEMICAL" },
  { name: "cleanout", code: "cleanout" },
  { name: "Cleanout-FL", code: "Cleanout-FL" },
  { name: "doubling", code: "doubling" },
  { name: "ENM1211", code: "ENM1211" },
  { name: "FBM1B0124", code: "FBM1B0124" },
  { name: "FBM1B0126", code: "FBM1B0126" },
  { name: "FBM1B0136", code: "FBM1B0136" },
  { name: "FBM1B0766", code: "FBM1B0766" },
  { name: "FBM1G016", code: "FBM1G016" },
  { name: "FBM1K056", code: "FBM1K056" },
  { name: "FBM1K246", code: "FBM1K246" },
  { name: "FBM1K396", code: "FBM1K396" },
  { name: "FBM1K496", code: "FBM1K496" },
  { name: "FBM1KK056", code: "FBM1KK056" },
  { name: "FBM1L616", code: "FBM1L616" },
  { name: "FBM1ML616", code: "FBM1ML616" },
  { name: "FBM1S276", code: "FBM1S276" },
  { name: "FBM1S466", code: "FBM1S466" },
  { name: "FBM1S536", code: "FBM1S536" },
  { name: "FBM1T026", code: "FBM1T026" },
  { name: "FBM1T0436", code: "FBM1T0436" },
  { name: "FBM1T0446", code: "FBM1T0446" },
  { name: "FBM1T2356", code: "FBM1T2356" },
  { name: "FBM1T416", code: "FBM1T416" },
  { name: "FBM1T426", code: "FBM1T426" },
  { name: "FBM1T586", code: "FBM1T586" },
  { name: "FBM1T676", code: "FBM1T676" },
  { name: "FBM1W326", code: "FBM1W326" },
  { name: "FILLERREPASS", code: "MS274" },
  { name: "FINALCHEMICAL", code: "FINALCHEMICAL" },
  { name: "G016", code: "REPASSG016" },
  { name: "HOLDMASTER", code: "MT0441-MG011HOLD" },
  { name: "HOLDS466", code: "HOLDS466" },
  { name: "I2122", code: "I2122" },
  { name: "I2155", code: "I2155" },
  { name: "manualsilica", code: "manualsilica" },
  { name: "MASTTSR", code: "MASTTSR" },
  { name: "MB0121", code: "MB0121" },
  { name: "MB0122", code: "MB0122" },
  { name: "MB0124", code: "MB0124" },
  { name: "MB0131", code: "MB0131" },
  { name: "MB0134", code: "MB0134" },
  { name: "MB0761", code: "MB0761" },
  { name: "MB0764", code: "MB0764" },
  { name: "MB330", code: "MB330" },
  { name: "MG011", code: "MG011" },
  { name: "MG2112", code: "MG2112" },
  { name: "MK051", code: "MK051" },
  { name: "MK241", code: "MK241" },
  { name: "MK391", code: "MK391" },
  { name: "MK394", code: "MK394" },
  { name: "MK491", code: "MK491" },
  { name: "ML611", code: "ML611" },
  { name: "MM8080", code: "MM8080" },
  { name: "MN333", code: "MN333" },
  { name: "MNU177", code: "MNU177" },
  { name: "MNU178", code: "MNU178" },
  { name: "MNU1983", code: "MNU1983" },
  { name: "MS271", code: "MS271" },
  { name: "MS272", code: "MS272" },
  { name: "MS461", code: "MS461" },
  { name: "MS462", code: "MS462" },
  { name: "MS464", code: "MS464" },
  { name: "MS5001", code: "MS5001" },
  { name: "MS5002", code: "MS5002" },
  { name: "MS531", code: "MS531" },
  { name: "MS532", code: "MS532" },
  { name: "MS534", code: "BEADINSUMASTER" },
  { name: "MT021", code: "MT021" },
  { name: "MT024", code: "MT024" },
  { name: "MT0431", code: "MT0431" },
  { name: "MT0434", code: "MT0434" },
  { name: "MT0441", code: "MT0441" },
  { name: "MT0444", code: "MT0444" },
  { name: "MT101", code: "MT101" },
  { name: "MT104", code: "MT104" },
  { name: "MT1111", code: "MT1111" },
  { name: "MT1114", code: "MT1114" },
  { name: "MT2354", code: "MT2354" },
  { name: "MT411", code: "MT411" },
  { name: "MT421", code: "MT421" },
  { name: "MT424", code: "MT424" },
  { name: "MT581", code: "MT581" },
  { name: "MT584", code: "MT584" },
  { name: "MT671", code: "MT671" },
  { name: "MT674", code: "MT674" },
  { name: "MT981", code: "MT981" },
  { name: "MT984", code: "MT984" },
  { name: "MTU176", code: "MTU176" },
  { name: "MW321", code: "MW321" },
  { name: "R1502", code: "R1502" },
  { name: "R1678", code: "R1678" },
  { name: "R1723", code: "R1723" },
  { name: "R2322", code: "synrubber3" },
  { name: "R2322E", code: "synrubber4" },
  { name: "R2555", code: "R2555" },
  { name: "REPASS", code: "REPASS" },
  { name: "REWORK", code: "REWORK" },
  { name: "REWORK-FINAL", code: "REWORK-FINAL" },
  { name: "RSS3", code: "RSS3" },
  { name: "RSS4", code: "RSS4" },
  { name: "RSS4DF", code: "RSS4DF" },
  { name: "RWL616", code: "RWL616" },
  { name: "RWS466", code: "RWS466" },
  { name: "RWT026", code: "RWT026" },
  { name: "RWT416", code: "RWT416" },
  { name: "RWW326", code: "RWW326" },
  { name: "Smalltest", code: "Smalltest" },
  { name: "T026RW", code: "T026RW" },
  { name: "T0446", code: "WRONGCARBONHOLDT0446" },
  { name: "T416RW", code: "T416RW" },
  { name: "TREADREPASS", code: "MT412" },
  { name: "TSR10", code: "BLOCKRUBBER" },
  { name: "TSR20", code: "TSR20" },
  { name: "TSR3L", code: "TSR3L" },
  { name: "MASTERCHEMICAL", code: "CHEMICAL" },
];


const oilAOptions = [
  { name: "R6347", code: "R6347" },
  { name: "388B", code: "388B" }
];

const oilBOptions = [
  { name: "OilB1", code: "OILB1" },
  { name: "OilB2", code: "OILB2" },
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

    if (checkboxTextFields.has(normalizedKey)) return "checkbox-text";
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

    function cleanMaterialArray(arr, nameKey, codeKey) {
        if (!Array.isArray(arr)) return [];
        return arr.filter(item => {
            const name = item[nameKey]?.toString().trim();
            const code = item[codeKey]?.toString().trim();
            return name !== "" && name !== "0" && code !== "" && code !== "0";
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

        const index = data.recipe_weight_poly.findIndex(row => row[key] === val);
        if (index === -1) return;

        setData(prev => {
          const updated = [...prev.recipe_weight_poly];
          updated[index] = {
            ...updated[index],
            POLY_materialName: selectedName,
            POLY_materialCode: selected?.code || ""
          };
          return { ...prev, recipe_weight_poly: updated };
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


// if (key === "OIL_B_materialName") {
//   return (
//     <select
//       value={val}
//       onChange={(e) => {
//         const selectedName = e.target.value;
//         const selected = oilBOptions.find(opt => opt.name === selectedName);

//         const index = data.recipe_weight_oil_b.findIndex(row => row[key] === val);
//         if (index === -1) return;

//         setData(prev => {
//           const updated = [...prev.recipe_weight_oil_b];
//           updated[index] = {
//             ...updated[index],
//             OIL_B_materialName: selectedName,
//             OIL_B_materialCode: selected?.code || ""
//           };
//           return { ...prev, recipe_weight_oil_b: updated };
//         });
//       }}
//     >
//       <option value="">-- Select Oil B Material --</option>
//       {oilBOptions.map(opt => (
//         <option key={opt.name} value={opt.name}>{opt.name}</option>
//       ))}
//     </select>
//   );
// }



        if (key === "mix_action") {
            const actions = mixingActions.length > 0 ? mixingActions : staticMixingActions;
            return (
                <select value={val || ""} onChange={(e) => onChange(e.target.value)}>
                    <option value="">-- Select Action --</option>
                    {actions.map((act) => <option key={act} value={act}>{act}</option>)}
                </select>
            );
        }
        if (key === "mix_condition") {
            return (
                <select value={val || ""} onChange={(e) => onChange(e.target.value)}>
                    <option value="">-- Select Condition --</option>
                    {staticMixConditions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
            );
        }
        if (key === "Act") {
            const mixerOpts = [" ","Weigh", "Weigh To", "Discharge"];
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

        if (type === "checkbox-text") {
            const labelValue = key.trim();
            return (
                <input
                    type="checkbox"
                    checked={val === labelValue}
                    onChange={(e) => onChange(e.target.checked ? labelValue : "")}
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
                    <span>{key.replace("recipe_weight_", "").toUpperCase()}</span>
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
