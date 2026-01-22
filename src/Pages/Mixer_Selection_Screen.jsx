import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MixerContext } from "../context/MixerContext";
import "./MixerSelection.css";
import { setCurrentMixer } from '../api/mixerInterceptor'; // adjust path!


const mixers = ["Mixer1", "Mixer2", "Mixer3"];

const MixerSelection = () => {
  const { setSelectedMixer } = useContext(MixerContext);
  const navigate = useNavigate();

  const handleSelect = (mixer) => {
    setSelectedMixer(mixer);
     setCurrentMixer(mixer);
      console.log("Selected mixer:", mixer);
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
            <div className="card-accent"></div>

            <div className="card-content">
              <h3>{mixer}</h3>
              <p>
                Click to select this mixer and continue with the workflow.
              </p>
              <span className="card-link">Learn More</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MixerSelection;
