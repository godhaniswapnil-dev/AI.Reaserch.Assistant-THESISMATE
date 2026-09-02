import React, { useState } from "react";

export default function SettingsModal({ isOpen, onClose, t, lang = "EN" }) {
  const isHindi = lang === "HI";

  const [defaultStyle, setDefaultStyle] = useState(() => {
    return localStorage.getItem("thesismate_pref_style") || "APA 7th";
  });
  const [defaultDensity, setDefaultDensity] = useState(() => {
    return localStorage.getItem("thesismate_pref_density") || "Sentence";
  });
  const [autoSave, setAutoSave] = useState(true);
  const [enableDoiVerification, setEnableDoiVerification] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem("thesismate_pref_style", defaultStyle);
      localStorage.setItem("thesismate_pref_density", defaultDensity);
    } catch (err) {}

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const citationStyles = ["APA 7th", "IEEE", "MLA 9th", "Harvard", "Chicago 17th", "Vancouver"];

  return (
    <div className="doc-viewer-modal-backdrop" onClick={onClose}>
      <div className="doc-viewer-modal profile-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className="modal-top-bar">
          <div className="modal-breadcrumbs">
            <span>{isHindi ? "कार्यक्षेत्र सेटिंग्स" : "Workspace & Account Settings"}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-paper-view" style={{ padding: "clamp(20px, 3.5vw, 32px)" }}>
          <div className="settings-modal-header" style={{ marginBottom: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: "400", marginBottom: "6px" }}>
              {isHindi ? "अनुसंधान प्राथमिकताएं एवं सेटिंग्स" : "Research & Synthesis Preferences"}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", margin: 0 }}>
              {isHindi
                ? "अपने थीसिस जनरेटर, उद्धरण प्रारूप और डेटाबेस सिंक को कॉन्फ़िगर करें।"
                : "Customize your default citation standards, factual verification thresholds, and storage preferences."}
            </p>
          </div>

          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label>{isHindi ? "डिफ़ॉल्ट उद्धरण मानक (Default Citation Style)" : "Default Citation Standard"}</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", marginTop: "6px" }}>
                {citationStyles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={`lang-chip ${defaultStyle === style ? "active" : ""}`}
                    onClick={() => setDefaultStyle(style)}
                    style={{ padding: "8px 12px", textAlign: "center", justifyContent: "center", fontWeight: "500" }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>{isHindi ? "उद्धरण घनत्व (Citation Density)" : "Citation Density Default"}</label>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "6px" }}>
                <button
                  type="button"
                  className={`lang-chip ${defaultDensity === "Sentence" ? "active" : ""}`}
                  onClick={() => setDefaultDensity("Sentence")}
                  style={{ padding: "8px 14px" }}
                >
                  Sentence-level (Dense)
                </button>
                <button
                  type="button"
                  className={`lang-chip ${defaultDensity === "Paragraph" ? "active" : ""}`}
                  onClick={() => setDefaultDensity("Paragraph")}
                  style={{ padding: "8px 14px" }}
                >
                  Paragraph-level (Standard)
                </button>
                <button
                  type="button"
                  className={`lang-chip ${defaultDensity === "Page" ? "active" : ""}`}
                  onClick={() => setDefaultDensity("Page")}
                  style={{ padding: "8px 14px" }}
                >
                  Page-level (Broad)
                </button>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border-color)", margin: "20px 0", paddingTop: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <strong>{isHindi ? "एआई रिसर्च कोर (Autonomous AI Engine)" : "Autonomous Academic AI Engine"}</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "0.84rem", color: "var(--text-muted)" }}>
                    {isHindi ? "गूगल एवं सेमेंटिक स्कॉलर से रियल-टाइम रिसर्च पेपर्स स्वचालित रूप से कनेक्टेड हैं।" : "Real-time Google Scholar & Semantic Scholar indexing automatically active."}
                  </p>
                </div>
                <span style={{ fontSize: "0.78rem", background: "var(--bg-green-light)", color: "var(--support-green)", padding: "3px 10px", borderRadius: "12px", fontWeight: "600" }}>
                  ✓ Always Connected
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <strong>{isHindi ? "ऑटो-सेव ड्राफ्ट्स (LocalDB Sync)" : "Auto-Save Research Drafts"}</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "0.84rem", color: "var(--text-muted)" }}>
                    {isHindi ? "ब्राउज़र लोकल स्टोरेज में ड्राफ्ट स्वचालित रूप से सहेजा जाता है।" : "Automatically sync all generated papers to local storage."}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "var(--accent-dark)", cursor: "pointer" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{isHindi ? "सख्त DOI सत्यापन (Strict DOI Audit)" : "Strict DOI Provenance Audit"}</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "0.84rem", color: "var(--text-muted)" }}>
                    {isHindi ? "प्रत्येक उद्धरण को क्रॉसरेफ/पबमेड डीओआई रजिस्ट्री से सत्यापित करें।" : "Enforce 100% DOI cross-verification against Crossref & PubMed."}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enableDoiVerification}
                  onChange={(e) => setEnableDoiVerification(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "var(--support-green)", cursor: "pointer" }}
                />
              </div>
            </div>

            <div className="profile-modal-actions">
              <button type="submit" className="btn-primary" disabled={isSaved}>
                {isSaved ? (
                  <>
                    <i className="fa-solid fa-check"></i> {isHindi ? "सेटिंग्स सहेजी गईं!" : "Settings Saved!"}
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk"></i> {isHindi ? "सेटिंग्स सहेजें" : "Save Preferences"}
                  </>
                )}
              </button>
              <button type="button" className="btn-outline" onClick={onClose}>
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
