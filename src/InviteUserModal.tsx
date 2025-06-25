import React, { useState } from "react";
import "./InviteUserModal.css";

const InviteUserModal = ({ date, onClose, onInvite }) => {
  const [email, setEmail] = useState("");

  if (!date) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      onInvite(email);
      setEmail("");
      onClose();
    }
  };

  return (
    <div className="invite-modal-overlay">
      <form className="invite-modal-form" onSubmit={handleSubmit}>
        <h3>Invite User for {date.toLocaleDateString()}</h3>
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="invite-modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">Invite</button>
        </div>
      </form>
    </div>
  );
};

export default InviteUserModal;
