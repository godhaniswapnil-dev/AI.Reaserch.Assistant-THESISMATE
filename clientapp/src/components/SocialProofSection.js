import React from "react";

export default function SocialProofSection({ t }) {
  return (
    <div className="social-proof-section">
      {/* 2 HORIZONTAL LINES STRIP FOR RESEARCHERS */}
      <div className="researchers-banner-box">
        <div className="researchers-banner-inner">
          <span className="researchers-eyebrow">{t.trustedBy || "TRUSTED BY RESEARCHERS AT"}</span>
          <div className="institution-logos-strip">
            <span className="inst-serif">Cambridge</span>
            <span className="inst-sans">MIT</span>
            <span className="inst-serif">Stanford</span>
            <span className="inst-serif">IEEE</span>
            <span className="inst-serif">Oxford</span>
            <span className="inst-serif">Tsinghua</span>
          </div>
        </div>
      </div>

      <div className="proof-grid">
        <div className="testimonial-column">
          <h6 className="eyebrow-heading">{t.userInterview}</h6>
          <blockquote className="testimonial-text">
            {t.testimonialQuote}
          </blockquote>

          <div className="author-profile">
            <div className="author-avatar">GS</div>
            <div className="author-meta">
              <span className="author-name">Swapnil Godhani</span>
              <span className="author-title">CEng MIMechE · M-Phil</span>
            </div>
          </div>
        </div>

        <div className="stats-column">
          <div className="stat-card">
            <h3>100k<span>+</span></h3>
            <p>{t.docsWritten}</p>
          </div>
          <div className="stat-card">
            <h3>94<span>%</span></h3>
            <p>{t.citationAccuracy}</p>
          </div>
          <div className="stat-card">
            <h3>20<span>+</span></h3>
            <p>{t.languagesSupported}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
