import React from "react";
import "./Settings.css";
import { IconCamera } from "./Icons";

export default function Profile() {
  return (
    <div className="settings-page">
      <div className="settings-container fade-in" style={{ display: 'block', maxWidth: '700px' }}>
        <h2 className="settings-title" style={{ marginBottom: '32px' }}>Profile</h2>
        
        <div className="settings-card">
          <div className="profile-identity-header">
            <div className="avatar-container">
              <div className="avatar-circle large">JD</div>
              <button className="avatar-upload-btn">
                <IconCamera />
              </button>
            </div>
            <div className="identity-info">
              <h2>John Doe</h2>
              <div className="identity-sub">
                <span className="handle">@johndoe</span>
              </div>
            </div>
          </div>

          <div className="settings-form">
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" defaultValue="John Doe" className="minimal-input" />
            </div>
            
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" defaultValue="john@example.com" className="minimal-input" />
            </div>

            <div className="input-group">
              <label>Bio / Short Description</label>
              <textarea 
                defaultValue="Product designer and frontend developer." 
                className="minimal-input" 
                rows="2"
              ></textarea>
            </div>
          </div>

          <div className="action-bar">
            <button className="btn-cancel">Cancel</button>
            <button className="btn-save">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
