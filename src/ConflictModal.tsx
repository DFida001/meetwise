import React from "react";
import "./ConflictModal.css";

const ConflictModal = ({ conflictEvent, onClose }) => {
  return (
    <div className="conflict-modal-overlay">
      <div className="conflict-modal-content">
        <h3>Meeting Conflict</h3>
        <p>The selected time slot conflicts with another event:</p>
        <div className="conflict-event-details">
          <strong>{conflictEvent.title}</strong>
          <br />
          {conflictEvent.start} - {conflictEvent.end}
        </div>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default ConflictModal;
