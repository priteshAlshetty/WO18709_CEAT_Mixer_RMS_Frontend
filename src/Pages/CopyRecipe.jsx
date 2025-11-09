import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RecipePage.css";
const apiUrl = import.meta.env.VITE_API_URL;

const BASE_URL = `${apiUrl}/recipe`;

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function replaceRecipeIdRecursive(obj, newId) {
  if (Array.isArray(obj)) {
    return obj.map((item) => replaceRecipeIdRecursive(item, newId));
  }
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (k === "recipe_id") {
        out[k] = newId;
      } else {
        out[k] = replaceRecipeIdRecursive(v, newId);
      }
    }
    return out;
  }
  return obj;
}

const RecipeCopyPage = () => {
  const [fromRecipeId, setFromRecipeId] = useState("");
  const [toRecipeId, setToRecipeId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCopyRecipe = async () => {
    if (!fromRecipeId || !toRecipeId) {
      toast.warn("Please enter both 'Copy From' and 'Copy To' recipe IDs.");
      return;
    }

    const confirmCopy = window.confirm(
      `Are you sure you want to copy recipe "${fromRecipeId}" as new recipe "${toRecipeId}"?`
    );
    if (!confirmCopy) return;

    try {
      setLoading(true);
      toast.info("Fetching recipe data...");

      const res = await axios.post(`${BASE_URL}/viewRecipe/byId`, {
        recipe_id: fromRecipeId,
      });

      const data = res.data?.data ?? res.data;
      if (!data || data.success === false) {
        toast.error("Failed to fetch recipe data.");
        setLoading(false);
        return;
      }

      let cloned = deepClone(data);
      cloned.recipe_id = toRecipeId;
      cloned = replaceRecipeIdRecursive(cloned, toRecipeId);

      const recipe_weighing_obj =
        Array.isArray(cloned.recipe_weighing) && cloned.recipe_weighing.length > 0
          ? cloned.recipe_weighing[0]
          : {};

      const body = {
        recipe: {
          recipe_id: toRecipeId,
          recipe_weighing: {
            ...recipe_weighing_obj,
            recipe_id: toRecipeId,
          },
          recipe_mixing: cloned.recipe_mixing || [],
          recipe_weight_CB: cloned.recipe_weight_CB || [],
          recipe_weight_poly: cloned.recipe_weight_poly || [],
          recipe_weight_oil_a: cloned.recipe_weight_oil_a || [],
          recipe_weight_chemical_PD: cloned.recipe_weight_PD || [],
          recipe_weight_oil_b: cloned.recipe_weight_oil_b || [],
          recipe_weight_filler: cloned.recipe_weight_filler || [],
        },
      };

      toast.info("Copying recipe...");
      const saveRes = await axios.post(`${BASE_URL}/addNewRecipe`, body);

      const success =
        saveRes.data?.success === true ||
        saveRes.data?.data?.success === true ||
        saveRes.data?.status?.toLowerCase() === "ok";

      if (success) {
        toast.success(`Recipe "${toRecipeId}" copied successfully!`);
      } else {
        const msg =
          saveRes.data?.message ||
          saveRes.data?.error ||
          JSON.stringify(saveRes.data).slice(0, 200);
        toast.error(`Failed to copy recipe: ${msg}`);
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      toast.error(`Error: ${JSON.stringify(msg)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="main_div"><h2 style={{ textAlign: "center", marginBottom: "20px" }}>Copy Recipe</h2>
    <div className="Copy_div"
      style={{
        padding: "30px",
        maxWidth: "500px",
        margin: "50px auto",
        
        background: "#linear-gradient(13deg, #ff8d8d 0%, rgb(23, 37, 161) 100%)",
        
      }}
    >
      

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", fontWeight: "bold" }}>Copy From (Recipe ID)</label>
        <input
          type="text"
          value={fromRecipeId}
          onChange={(e) => setFromRecipeId(e.target.value)}
          placeholder="Enter existing recipe ID"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontWeight: "bold" }}>Copy To (New Recipe ID)</label>
        <input
          type="text"
          value={toRecipeId}
          onChange={(e) => setToRecipeId(e.target.value)}
          placeholder="Enter new recipe ID"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <button
        onClick={handleCopyRecipe}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#22ac37ff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        {loading ? "Processing..." : "Copy Recipe"}
      </button>

      {/* ✅ Toasts now appear at bottom right */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  </div>
    
  );
};

export default RecipeCopyPage;
