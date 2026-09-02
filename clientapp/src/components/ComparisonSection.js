import React from "react";

export default function ComparisonSection({ t }) {
  const thesisMateFeatures = [
    "Full literature review",
    "Inline citations to verifiable sources",
    "Citation verification",
    "Reads up to 500 papers",
    "Up to 80 pages with ONE prompt",
    "Output as PDF, Word, LaTeX, BibTeX",
  ];

  const claudeDrawbacks = [
    "Requires many prompts",
    "Prone to hallucinations",
    "No citation verification",
    "Reads only a limited number of papers",
    "Limited output length",
    "Plain text output",
  ];

  return (
    <section id="comparison" className="comparison-section">
      <span className="subheading">{t.compareSub}</span>
      <h2 className="section-title">
        {t.compareTitlePrefix} <i>{t.compareTitleItalic}</i>
      </h2>
      <p className="section-desc">
        {t.compareDesc}
      </p>

      <div className="compare-grid">
        <div className="mockup-card">
          <div className="mockup-header">
            <span>1 ThesisMate</span> <span>9:41</span>
          </div>
          <h3 className="doc-title">
            Comprehensive Analysis of the Sharing Economy: Benefits, Challenges, and Market Participant Roles
          </h3>
          <div className="doc-meta">
            Dr. S. Godhani • swapnil@thesismate.io • May 14, 2026
          </div>
          <p style={{ fontSize: "0.95rem" }}>
            <strong>Abstract</strong><br />
            This study provides a comprehensive analysis of the sharing economy,
            emphasizing its defining characteristics...
          </p>
        </div>

        <div className="mockup-card">
          <div className="mockup-header">
            <span>✧ Standard Chatbot</span> <span>9:41</span>
          </div>
          <div className="chat-bubble" style={{ background: "#F3F0E6" }}>
            Write thesis about sharing economy, analyze the benefits and drawbacks.
          </div>
          <div className="chat-bubble">
            <strong>The Sharing Economy: Benefits and Drawbacks</strong><br /><br />
            <em>Abstract</em><br />
            The sharing economy has reshaped how individuals access goods and services...
          </div>
        </div>
      </div>

      <div className="feature-check-list">
        <div>
          <h4 style={{ marginBottom: "15px", fontFamily: "var(--font-serif)" }}>
            {t.compareDelivers}
          </h4>
          <ul>
            {thesisMateFeatures.map((item, i) => (
              <li key={i}>
                <span className="check-icon">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: "15px", fontFamily: "var(--font-serif)" }}>
            {t.compareFallsShort}
          </h4>
          <ul>
            {claudeDrawbacks.map((item, i) => (
              <li key={i}>
                <span className="cross-icon">✕</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
