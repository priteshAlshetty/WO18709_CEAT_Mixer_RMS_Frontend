import { useState } from 'react';
import api from '../api/axios';   // adjust path if needed

import './DeleteRecipe.css';

const apiUrl = import.meta.env.VITE_API_URL;

const DeleteRecipe = () => {
  const [recipeId, setRecipeId] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

const handleDelete = async () => {
  try {
    const res = await api.delete('/recipe/deleteRecipe/byId', {
      data: { recipe_id: recipeId },
    });

    setResponse(res.data);
    setError('');
    setRecipeId('');
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong');
    setResponse(null);
  } finally {
    setShowModal(false);
  }
};


  const openConfirmModal = () => {
    if (!recipeId.trim()) {
      setError('Please enter a valid recipe ID.');
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="delete-recipe-container">
      <h2>Delete Recipe</h2>
      <input
        type="text"
        placeholder="Enter Recipe ID"
        value={recipeId}
        onChange={(e) => setRecipeId(e.target.value)}
      />
      <button onClick={openConfirmModal}> Delete Recipe</button>

      {response && (
        <div className="response-message">
          <strong>{response.message}</strong>
          <pre>{JSON.stringify(response.data, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete the recipe with ID:</p>
            <strong>{recipeId}</strong>
            <div className="modal-buttons">
              <button className="confirm" onClick={handleDelete}>Yes, Delete</button>
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteRecipe;
