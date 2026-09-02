import React from "react";
import ResearchWalkthroughVideo from "./ResearchWalkthroughVideo";

export default function IntegrationsSection({ onFeatureClick, t }) {
  const integrations = [
    {
      id: "zotero",
      name: "ZOTERO",
      renderLogo: () => (
        <span className="brand-logo-zotero">zotero</span>
      )
    },
    {
      id: "mendeley",
      name: "MENDELEY",
      renderLogo: () => (
        <svg viewBox="0 0 40 32" className="brand-svg mendeley-svg" fill="currentColor">
          <circle cx="20" cy="8" r="6" />
          <circle cx="8" cy="24" r="5.5" />
          <circle cx="32" cy="24" r="5.5" />
          <path d="M 20 8 Q 14 15 8 24 Q 14 20 20 20 Q 26 20 32 24 Q 26 15 20 8 Z" />
          <circle cx="20" cy="15" r="2.4" fill="#faf8f5" />
        </svg>
      )
    },
    {
      id: "semanticscholar",
      name: "SEMANTIC SCHOLAR",
      renderLogo: () => (
        <svg viewBox="0 0 42 32" className="brand-svg semanticscholar-svg" fill="currentColor">
          <path d="M 4 8 C 4 8 11 5 18 8 L 18 24 C 11 21 4 24 4 24 Z" opacity="0.45" />
          <path d="M 18 8 C 23 5.5 32 6 38 9 L 20 29 L 12 20 L 15.5 16.5 L 20 22 L 33 13 C 28 10 23 9.5 18 11.5 Z" />
        </svg>
      )
    },
    {
      id: "overleaf",
      name: "OVERLEAF",
      renderLogo: () => (
        <svg viewBox="0 0 152 40" className="brand-svg overleaf-brand-svg" fill="currentColor">
          {/* Leaf on top of O */}
          <path d="M 23.5 3 C 17 3 10.5 8.5 8.5 15 C 13 13 19 14.2 22 17.5 C 24 15 27.5 11.5 32 11 C 29 7 26 3 23.5 3 Z" />
          {/* O ring body */}
          <path d="M 21.5 11.5 C 12.5 11.5 5.5 18.5 5.5 27.5 C 5.5 36.5 12.5 43.5 21.5 43.5 C 30.5 43.5 37.5 36.5 37.5 27.5 C 37.5 22.5 34.8 17.8 30.5 14.8 C 27.5 12.5 24.5 11.5 21.5 11.5 Z M 21.5 37.5 C 16 37.5 11.5 33 11.5 27.5 C 11.5 22 16 17.5 21.5 17.5 C 27 17.5 31.5 22 31.5 27.5 C 31.5 33 27 37.5 21.5 37.5 Z" />
          {/* Text "verleaf" */}
          <text x="41" y="36.5" fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontSize="29" fontWeight="700" letterSpacing="-0.8px">verleaf</text>
        </svg>
      )
    },
    {
      id: "latex",
      name: "LATEX",
      renderLogo: () => (
        <span className="brand-logo-latex">
          <span>L</span><span className="latex-a">A</span><span>T</span><span className="latex-e">E</span><span>X</span>
        </span>
      )
    }
  ];

  const stats = [
    { value: "1", unit: "prompt", label: t.statPrompt || "One Prompt Synthesized" },
    { value: "200", unit: "M+", label: t.statSources || "Sources Indexed" },
    { value: "26", unit: "m", label: t.statDraft || "Average Synthesis Time" },
    { value: "100", unit: "%", label: t.statVerified || "Verified DOI Lineage" },
  ];

  return (
    <section id="integrations">
      {/* 2 HORIZONTAL LINES STRIP AS IN SCREENSHOT */}
      <div className="integrations-banner-box">
        <div className="integrations-banner-inner">
          <span className="integrations-eyebrow">{t.trustedIntegrations || "TRUSTED INTEGRATIONS"}</span>
          <div className="integrations-strip">
            {integrations.map((item) => (
              <div key={item.id} className="integration-item">
                <div className="integration-logo-wrapper">
                  {item.renderLogo()}
                </div>
                <span className="integration-hover-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <span className="subheading">{t.walkthroughSub}</span>
      <h2 className="section-title">
        {t.walkthroughTitlePrefix} <i>{t.walkthroughTitleItalic}</i>
      </h2>
      <p className="section-desc">
        {t.walkthroughDesc}
      </p>

      <div className="video-author">
        <div className="avatar">A</div>
        <div style={{ fontSize: "0.9rem" }}>
          <strong>{t.walkthroughAuthor}</strong><br />
          <span style={{ color: "var(--text-light)" }}>
            {t.walkthroughRole}
          </span>
        </div>
      </div>

      <ResearchWalkthroughVideo onFeatureClick={onFeatureClick} t={t} />

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <h4>
              {stat.value}
              <i>{stat.unit}</i>
            </h4>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="stats-actions">
        <button className="btn-primary" onClick={onFeatureClick}>
          {t.heroBtnStart} <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </section>
  );
}
