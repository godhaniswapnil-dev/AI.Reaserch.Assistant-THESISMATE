import React from "react";
import SettingsPanel from "./SettingsPanel";

export default function HeroSection({ onFeatureClick, onGeneratedDoc, username, currentUser, t }) {
  const features = [
    { num: "01", icon: "📄", text: t.feat01 },
    { num: "02", icon: "↑", text: t.feat02 },
    { num: "03", icon: "⬇", text: t.feat03 },
    { num: "04", icon: "→", text: t.feat04 },
    {
      num: "05",
      icon: "⚡",
      text: t.feat05,
    },
  ];

  return (
    <section id="home" className="hero">
      <div className="hero-badge">{t.heroBadge}</div>
      <h1>
        {t.heroTitlePrefix} <i>{t.heroTitleItalic}</i>
      </h1>

      <div className="hero-actions">
        <button
          className="btn-primary"
          style={{ padding: "14px 30px", fontSize: "1.1rem", display: "inline-flex", alignItems: "center", gap: "8px" }}
          onClick={onFeatureClick}
        >
          <span>{t.heroBtnStart}</span>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
        <button
          className="btn-outline bg-white"
          style={{ padding: "14px 30px", fontSize: "1.1rem", color: "var(--text-main)" }}
          onClick={() => {
            const comp = document.getElementById("comparison");
            if (comp) comp.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {t.heroBtnExamples}
        </button>
      </div>
      <p>{t.heroDesc}</p>

      <div className="hero-grid">
        <div className="feature-list">
          {features.map((item) => (
            <div key={item.num} className="feature-card">
              <div className="feature-left">
                <div className="icon-box">{item.icon}</div>
                <div className="feature-text">{item.text}</div>
              </div>
              <span className="feature-num">{item.num}</span>
            </div>
          ))}
        </div>

        <SettingsPanel t={t} onGeneratedDoc={onGeneratedDoc} username={username} currentUser={currentUser} />
      </div>
    </section>
  );
}
