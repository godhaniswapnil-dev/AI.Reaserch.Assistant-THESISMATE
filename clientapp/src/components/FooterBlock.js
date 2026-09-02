import React from "react";
import AiResearchChat from "./AiResearchChat";

export default function FooterBlock({ t, onNavigate, lang = "EN", username = "Researcher" }) {
  const handlePrivacyClick = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate("privacy");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate("about");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavSection = (sectionId, e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate("home");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  return (
    <div className="bottom-sections-wrapper" id="contact">
      <div className="contact-section">
        <div className="contact-eyebrow">
          <span className="eyebrow-text">{t.contactEyebrow}</span>
          <span className="online-status">
            <span className="status-dot">●</span> {t.contactStatus}
          </span>
        </div>

        <h2 className="contact-heading">
          {t.contactTitlePrefix} <i>{t.contactTitleItalic}</i>
        </h2>

        <p className="contact-subtext">
          {t.contactDesc}
        </p>

        {/* --- AI RESEARCH CHAT: ASK QUESTIONS DIRECTLY TO AI --- */}
        <AiResearchChat onNavigate={onNavigate} t={t} lang={lang} username={username} />
      </div>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-grid">
            <div className="footer-brand-col">
              <div className="footer-logo">
                <div className="footer-logo-icon"><i>1</i></div>
                <span className="footer-brand-name">ThesisMate</span>
              </div>
              <p className="brand-description">
                {t.footerBrandDesc}
              </p>
            </div>

            <div className="footer-links-col">
              <h6 className="footer-heading">{t.footerProduct}</h6>
              <ul className="footer-list">
                <li><a href="#integrations" onClick={(e) => handleNavSection("integrations", e)}>{t.navIntegrations}</a></li>
                <li><a href="#comparison" onClick={(e) => handleNavSection("comparison", e)}>{t.navCompare}</a></li>
                <li><a href="#citations" onClick={(e) => handleNavSection("citations", e)}>Citation Reports</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h6 className="footer-heading">{t.footerCompany}</h6>
              <ul className="footer-list">
                <li><a href="#about-us" onClick={handleAboutClick}>{t.navAbout}</a></li>
                <li><a href="#privacy" onClick={handlePrivacyClick}>{t.privacyPolicyTitle || "Privacy Policy"}</a></li>
                <li><a href="#terms" onClick={(e) => { e.preventDefault(); if (onNavigate) { onNavigate("terms"); window.scrollTo({ top: 0, behavior: "smooth" }); } }}>{t.navTerms || "Terms of Service"}</a></li>
                <li><a href="#contact" onClick={(e) => handleNavSection("contact", e)}>{t.navContact}</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>{t.footerRights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
