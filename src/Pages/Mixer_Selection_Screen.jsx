import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MixerContext } from "../context/MixerContext";
import "./MixerSelection.css";

const mixers = ["Mixer1", "Mixer2", "Mixer3"];

const MixerSelection = () => {
  const { setSelectedMixer } = useContext(MixerContext);
  const navigate = useNavigate();

  const handleSelect = (mixer) => {
    console.log("Selected Mixer:", mixer); // 🔍 DEBUG
    setSelectedMixer(mixer);
    navigate("/", { replace: true });
  };

  return (
    <div className="mixer-container">
        <h2>Please Select the Mixer First</h2>
      <div className="mixer-cards">
        {mixers.map((mixer) => (
          <div
            key={mixer}
            className="mixer-card"
            onClick={() => handleSelect(mixer)}
          >
            <h2>{mixer}</h2>
            <p>Click to select</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MixerSelection;
