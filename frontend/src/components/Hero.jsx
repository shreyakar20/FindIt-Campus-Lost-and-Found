import React from 'react';
import { Search, PlusCircle, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

const Hero = ({ onOpenReportModal, onScrollToListings }) => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-tag">
          <ShieldCheck size={16} />
          <span>Official Campus Lost &amp; Found System</span>
        </div>

        <h1 className="hero-title">
          Lost something on campus? <br />
          <span className="hero-gradient-text">Let's help you find it.</span>
        </h1>

        <p className="hero-description">
          A modern, open directory for students, professors, and campus staff.
          Report misplaced belongings, browse found items, and reunite with your valuables quickly.
        </p>

        <div className="hero-cta-group">
          <button
            type="button"
            className="btn btn-primary hero-btn"
            onClick={() => onOpenReportModal('Lost')}
          >
            <PlusCircle size={20} />
            <span>Report Lost Item</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary hero-btn"
            onClick={() => onOpenReportModal('Found')}
          >
            <CheckCircle2 size={20} />
            <span>I Found Something</span>
          </button>

          <button
            type="button"
            className="btn btn-ghost hero-btn"
            onClick={onScrollToListings}
          >
            <Search size={18} />
            <span>Browse All Listings</span>
          </button>
        </div>

        <div className="hero-features">
          <div className="hero-feature-item">
            <CheckCircle2 size={16} className="feature-icon" />
            <span>100% Free Campus Service</span>
          </div>
          <div className="hero-feature-item">
            <HeartHandshake size={16} className="feature-icon" />
            <span>Direct Student Contact</span>
          </div>
          <div className="hero-feature-item">
            <ShieldCheck size={16} className="feature-icon" />
            <span>Real-time MongoDB Cloud Storage</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
