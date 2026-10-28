import React from 'react';
import { Compass, PlusCircle, Sparkles, ShieldCheck } from 'lucide-react';

const Navbar = ({ onOpenReportModal, backendConnected, totalCount }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div className="navbar-brand">
          <div className="brand-icon-wrapper">
            <Compass className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">FindIt</span>
            <span className="brand-badge">Campus Portal</span>
          </div>
        </div>

        {/* Center / Navigation Info */}
        <div className="navbar-center">
          <div className="connection-pill" title={backendConnected ? 'Connected to FindIt Express API' : 'Checking API connection...'}>
            <span className={`status-dot ${backendConnected ? 'online' : 'offline'}`} />
            <span className="status-label">
              {backendConnected ? 'API Connected' : 'Connecting to Server...'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="navbar-actions">
          <button
            type="button"
            className="btn btn-primary nav-report-btn"
            onClick={() => onOpenReportModal()}
            id="nav-report-btn"
          >
            <PlusCircle size={18} />
            <span>Report an Item</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
