import React, { useState } from "react";
import "./EventMenu.css";

const EventMenu = ({ date, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  if (!date) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && start && end) {
      onSave({ title, start, end, date });
      setTitle("");
      setStart("");
      setEnd("");
      onClose();
    }
  };

  return (
    <div className="event-menu-overlay">
      <form className="event-menu-form" onSubmit={handleSubmit}>
        <h3>Add Event for {date.toLocaleDateString()}</h3>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div style={{ display: "flex", gap: "4%" }}>
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </div>
        <div className="event-menu-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EventMenu;
