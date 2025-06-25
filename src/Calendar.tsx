import React, { useState } from "react";
import "./Calendar.css";
import EventMenu from "./EventMenu.tsx";
import ContextMenu from "./ContextMenu.tsx";
import InviteUserModal from "./InviteUserModal.tsx";
import ConflictModal from "./ConflictModal.tsx";
import ShinyText from "./ShinyText.tsx";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

const Calendar = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    date: null,
  });
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflict, setConflict] = useState(null);

  function isTimeOverlap(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
  }

  const dates: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    dates.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    dates.push(d);
  }

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleDateClick = (date, e) => {
    if (!date) return;
    e.preventDefault();
    setSelectedDate(new Date(currentYear, currentMonth, date));
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, date });
  };

  const handleAddEvent = () => {
    setMenuOpen(true);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleInvite = () => {
    setInviteModalOpen(true);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleInviteUser = (email) => {
    alert(`Invitation sent to ${email}!`);
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
    setSelectedDate(null);
  };

  const handleCloseConflict = () => {
    setConflict(null);
    setConflictModalOpen(false);
  };

  const handleSaveEvent = (event) => {
    const key = event.date.toDateString();
    const dayEvents = events[key] || [];
    const conflictEvent = dayEvents.find((ev) =>
      isTimeOverlap(event.start, event.end, ev.start, ev.end)
    );
    if (conflictEvent) {
      setConflict(conflictEvent);
      setConflictModalOpen(true);
      return;
    }
    setEvents((prev) => ({
      ...prev,
      [key]: [
        ...dayEvents,
        { title: event.title, start: event.start, end: event.end },
      ],
    }));
    setMenuOpen(false);
    setSelectedDate(null);
  };

  return (
    <div
      className="calendar-app-bg"
      onClick={handleCloseContextMenu}
      style={{ minHeight: "100vh" }}
    >
      <header className="calendar-header">
        <ShinyText text="MeetWise" speed={4} className="calendar-app-title" />
      </header>
      <main className="calendar-main">
        <div className="calendar-container">
          <div className="calendar-title-bar">
            <button
              className="calendar-month-btn"
              onClick={handlePrevMonth}
              aria-label="Previous Month"
            >
              &#8592;
            </button>
            <h2 className="calendar-title" style={{ margin: 0 }}>
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button
              className="calendar-month-btn"
              onClick={handleNextMonth}
              aria-label="Next Month"
            >
              &#8594;
            </button>
          </div>
          <table className="calendar-table">
            <thead>
              <tr>
                {daysOfWeek.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(dates.length / 7) }).map(
                (_, weekIdx) => (
                  <tr key={weekIdx}>
                    {dates
                      .slice(weekIdx * 7, weekIdx * 7 + 7)
                      .map((date, idx) => {
                        const cellDate = date
                          ? new Date(currentYear, currentMonth, date)
                          : null;
                        const eventList = cellDate
                          ? events[cellDate.toDateString()]
                          : [];
                        const isSelected =
                          cellDate &&
                          selectedDate &&
                          cellDate.toDateString() ===
                            selectedDate.toDateString();
                        return (
                          <td
                            key={idx}
                            className={isSelected ? "selected" : undefined}
                            onContextMenu={(e) => handleDateClick(date, e)}
                          >
                            {date ? (
                              <div>
                                <div>{date}</div>
                                {eventList && eventList.length > 0 && (
                                  <ul className="event-list">
                                    {eventList.map((ev, i) => (
                                      <li key={i}>
                                        {ev.title} ({ev.start}-{ev.end})
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ) : (
                              ""
                            )}
                          </td>
                        );
                      })}
                  </tr>
                )
              )}
            </tbody>
          </table>
          {contextMenu.visible && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              onAddEvent={handleAddEvent}
              onInvite={handleInvite}
              onClose={handleCloseContextMenu}
            />
          )}
          {menuOpen && (
            <EventMenu
              date={selectedDate}
              onClose={handleCloseMenu}
              onSave={handleSaveEvent}
            />
          )}
          {inviteModalOpen && (
            <InviteUserModal
              date={selectedDate}
              onClose={() => setInviteModalOpen(false)}
              onInvite={handleInviteUser}
            />
          )}
          {conflictModalOpen && (
            <ConflictModal
              conflictEvent={conflict}
              onClose={handleCloseConflict}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Calendar;
