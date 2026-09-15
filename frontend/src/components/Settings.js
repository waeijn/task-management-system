import React, { useState } from "react";
import "./Settings.css";

export default function Settings() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app-theme") || "system";
  });

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("app-theme", newTheme);
    
    // Apply theme to document
    if (newTheme === "dark") {
      document.body.classList.add("dark-theme");
    } else if (newTheme === "light") {
      document.body.classList.remove("dark-theme");
    } else {
      // System
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add("dark-theme");
      } else {
        document.body.classList.remove("dark-theme");
      }
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container fade-in" style={{ display: 'block', maxWidth: '800px' }}>
        <h2 className="settings-title" style={{ marginBottom: '32px' }}>Settings</h2>

        <div className="settings-section">
          <h3 className="section-title">Preferences</h3>
          <div className="settings-card list-card">
            <div className="key-value-row no-border">
              <div className="row-info">
                <h4>Theme</h4>
                <p>Select your interface color scheme.</p>
              </div>
              <div className="row-control">
                <div className="theme-segmented">
                  <button className={`seg-btn ${theme === "system" ? "active" : ""}`} onClick={() => handleThemeChange("system")}>System</button>
                  <button className={`seg-btn ${theme === "dark" ? "active" : ""}`} onClick={() => handleThemeChange("dark")}>Dark</button>
                  <button className={`seg-btn ${theme === "light" ? "active" : ""}`} onClick={() => handleThemeChange("light")}>Light</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
