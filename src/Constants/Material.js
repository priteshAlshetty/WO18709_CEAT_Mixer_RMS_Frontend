

// src/constants/materialOptions.js

export const cbMaterialOptions = [];
export const chemicalPDOptions = [];
export const fillerOptions = [];
export const polyOptions = [];
export const oilAOptions = [];
export const oilBOptions = [];

// Async loader (safe for Vite)
(function loadOptions() {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      console.error("❌ VITE_API_URL is missing");
      return;
    }

    fetch(`${apiUrl}/material/getMaterials/options`)
      .then((res) => res.json())
      .then((json) => {
        if (!json?.success || !json?.data) {
          console.warn("❌ Invalid material options response:", json);
          return;
        }

        const { CB, PD, FL, Poly, Oil1, Oil2 } = json.data;

        cbMaterialOptions.splice(0, cbMaterialOptions.length, ...(CB || []));
        chemicalPDOptions.splice(0, chemicalPDOptions.length, ...(PD || []));
        fillerOptions.splice(0, fillerOptions.length, ...(FL || []));
        polyOptions.splice(0, polyOptions.length, ...(Poly || []));
        oilAOptions.splice(0, oilAOptions.length, ...(Oil1 || []));
        oilBOptions.splice(0, oilBOptions.length, ...(Oil2 || []));
      })
      .catch((err) => console.error("Failed to load material options:", err));
  } catch (err) {
    console.error("Loader error:", err);
  }
})();
