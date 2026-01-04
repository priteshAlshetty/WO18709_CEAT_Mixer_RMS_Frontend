import React from "react";
import "./Login_info.css";

const ProfileMenu = ({ user, onLogout, onAdmin }) => {
  const initials = user.name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="profile-root">
      <div className="profile-trigger">
        <div className="profile-avatar">{initials}</div>
        <span className="profile-username">{user.name}</span>
      </div>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar large">{initials}</div>
          <div>
            <h4>{user.name}</h4>
            <p>{user.role}</p>
          </div>
        </div>

        <div className="profile-menu">
          <button onClick={onAdmin}>
            👤 User Administration
          </button>
          <button className="danger" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;
