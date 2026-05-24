// import React, { useEffect, useState } from "react";
// import recipeData from "../data/Recipe_status_info.json";
// import "./Recipe_status.css";

// const RecipeStatusPage = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     setRecipes(recipeData.data);

//     /*
//       Later API

//       fetch("/api/recipes")
//         .then((res) => res.json())
//         .then((data) => setRecipes(data.data));
//     */
//   }, []);

//   const filteredRecipes = recipes.filter(
//     (recipe) =>
//       recipe.recipe_id.toLowerCase().includes(search.toLowerCase()) ||
//       recipe.recipe_name.toLowerCase().includes(search.toLowerCase())
//   );


//   const handleStatusToggle = (recipeId) => {
//   const confirmed = window.confirm(
//     "Are you sure you want to update recipe status?"
//   );

//   if (!confirmed) return;

//   const updatedRecipes = recipes.map((recipe) => {
//     if (recipe.recipe_id === recipeId) {
//       return {
//         ...recipe,
//         IsActivate: recipe.IsActivate === "1" ? "0" : "1",
//       };
//     }

//     return recipe;
//   });

//   setRecipes(updatedRecipes);

//   /*
//       LATER API CALL

//       fetch(`/api/recipe/${recipeId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           status:
//             recipe.IsActivate === "1" ? "0" : "1",
//         }),
//       })
//   */
// };

//   return (
//     <div className="page">
//       <div className="header">
//         <h2>Recipe Status</h2>

//         <input
//           type="text"
//           placeholder="Search recipe..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       <div className="table-container">
//         <table>
//           <thead>
//             <tr>
//               <th>Recipe ID</th>
//               <th>Recipe Name</th>
//               <th>Status</th>
//               <th>Modified Time</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//          <tbody>
//   {filteredRecipes.map((recipe, index) => (
//     <tr key={index}>
//       <td>{recipe.recipe_id}</td>

//       <td>{recipe.recipe_name}</td>

//       <td>
//         <span
//           className={
//             recipe.IsActivate === "1"
//               ? "status active"
//               : "status inactive"
//           }
//         >
//           {recipe.IsActivate === "1"
//             ? "Active"
//             : "Inactive"}
//         </span>
//       </td>

//       <td>{recipe.ModifyTime}</td>

//       <td>
//         <button
//           className="action-btn"
//           onClick={() => handleStatusToggle(recipe.recipe_id)}
//         >
//           {recipe.IsActivate === "1"
//             ? "Deactivate"
//             : "Activate"}
//         </button>
//       </td>
//     </tr>
//   ))}
// </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RecipeStatusPage;
import React, { useEffect, useState } from "react";
import "./Recipe_status.css";
import api from "../api/axios";

const RecipeStatusPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
  total: 0,
  active: 0,
  inactive: 0,
});

  // Fetch all recipes
  const fetchRecipes = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/recipeStatus/getAllRecipeStatus"
      );

      const result = response.data;

     if (result.success) {
  setRecipes(result.data);

  setStats({
    total: result.total_recipes,
    active: result.active_recipes,
    inactive: result.inactive_recipes,
  });
}
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on page load
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Toggle recipe status
const handleStatusToggle = async (recipe) => {
  const confirmed = window.confirm(
    `Are you sure you want to ${
      recipe.IsActivate === "1"
        ? "Deactivate"
        : "Activate"
    } this recipe?`
  );

  if (!confirmed) return;

  try {
    const updatedStatus =
      recipe.IsActivate === "1" ? 0 : 1;

    const response = await api.post(
      "/recipeStatus/updateRecipeStatus",
      {
        recipe_id: recipe.recipe_id,
        recipe_name: recipe.recipe_name,
        IsActivate: updatedStatus,
      }
    );

    const result = response.data;

    if (result.success) {
      alert(result.message);

      // Refresh latest data
      fetchRecipes();
    } else {
      alert("Failed to update recipe status");
    }
  } catch (error) {
    console.error("Error updating recipe:", error);
    alert("Something went wrong");
  }
};

  // Search filter
  const filteredRecipes = recipes.filter(
    (recipe) =>
      (recipe.recipe_id || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (recipe.recipe_name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="page">
        <div className="stats-container">
  <div className="stats-card">
    <span>Total Recipes</span>
    <h3>{stats.total}</h3>
  </div>

  <div className="stats-card active-card">
    <span>Active Recipes</span>
    <h3>{stats.active}</h3>
  </div>

  <div className="stats-card inactive-card">
    <span>Inactive Recipes</span>
    <h3>{stats.inactive}</h3>
  </div>
</div>
      <div className="header">
        <h2>Recipe Status</h2>

        <input
          type="text"
          placeholder="Search recipe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading recipes...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Recipe ID</th>
                <th>Recipe Name</th>
                <th>Status</th>
                <th>Modified Time</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe, index) => (
                  <tr key={index}>
                    <td>{recipe.recipe_id || "-"}</td>

                    <td>
                      {recipe.recipe_name || "-"}
                    </td>

                    <td>
                      <span
                        className={
                          recipe.IsActivate === "1"
                            ? "status active"
                            : "status inactive"
                        }
                      >
                        {recipe.IsActivate === "1"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      {recipe.ModifyTime
                        ? new Date(
                            recipe.ModifyTime
                          ).toLocaleString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
}).replace(/\//g, '-').replace(',', '     ')
                        : "-"}
                    </td>

                    <td>
                      <button
                        className="action-btn"
                        onClick={() =>
                          handleStatusToggle(recipe)
                        }
                      >
                        {recipe.IsActivate === "1"
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    No recipes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecipeStatusPage;