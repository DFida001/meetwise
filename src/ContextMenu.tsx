import React from "react";
import "./ContextMenu.css";

const ContextMenu = ({ x, y, onAddEvent, onInvite, onClose }) => {
  // Prevent menu from going off the right/bottom edge
  const menuRef = React.useRef(null);
  const [pos, setPos] = React.useState({ left: x, top: y });

  React.useEffect(() => {
    if (menuRef.current) {
      const menu = menuRef.current;
      const { innerWidth, innerHeight } = window;
      const rect = menu.getBoundingClientRect();
      let left = x;
      let top = y;
      if (x + rect.width > innerWidth) left = innerWidth - rect.width - 8;
      if (y + rect.height > innerHeight) top = innerHeight - rect.height - 8;
      setPos({ left, top });
    }
  }, [x, y]);

  return (
    <div
      className="context-menu"
      ref={menuRef}
      style={{ top: pos.top, left: pos.left, position: "fixed" }}
      onClick={onClose}
    >
      <ul>
        <li onClick={onAddEvent}>Add Event</li>
        <li onClick={onInvite}>Invite User</li>
      </ul>
    </div>
  );
};

export default ContextMenu;
