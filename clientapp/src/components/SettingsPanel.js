import React, { useState } from "react";
import { generateFullPaper } from "../services/researchGenerator";
import { getUserDocs, saveUserDocs, incrementUserPdfCount } from "../services/userStorage";
import { saveResearchPaperToBackend } from "../services/researchService";

export default function SettingsPanel({ t, onGeneratedDoc, username, currentUser }) {
  const [pageCount, setPageCount] = useState(25);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const [citationStyle, setCitationStyle] = useState("APA 7th");
  const [citationLevel, setCitationLevel] = useState(t.settingsDensitySentence || "Sentence-level (Dense)");
  const [docLang, setDocLang] = useState("English");

  const [isGenerating, setIsGenerating] = useState(false);
  const [genStepText, setGenStepText] = useState("");

  const citationStyles = ["APA 7th", "IEEE", "MLA 9th", "Harvard", "Chicago", "Vancouver"];
  const citationLevels = [
    t.settingsDensitySentence || "Sentence-level (Dense)",
    t.settingsDensityParagraph || "Paragraph-level (Standard)",
    t.settingsDensityPage || "Page-level (Broad)"
  ];
  const documentLanguages = [
    "English", "Hindi (हिंदी)", "Gujarati (ગુજરાતી)", "Spanish", "French", "German", "Chinese", "Japanese"
  ];

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0].name);
    }
  };

  const handleGenerateNow = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenStepText(t.settingsGenerating || "Synthesizing Draft & Citations...");

    setTimeout(() => {
      setGenStepText("Extracting peer-reviewed DOIs...");
    }, 1000);

    setTimeout(() => {
      setGenStepText(`Compiling ${pageCount} Pages (${citationStyle} • ${docLang})...`);
    }, 2000);

    setTimeout(() => {
      const defaultTopic = uploadedFile
        ? `Comprehensive Scientific Investigation & Synthesis of ${uploadedFile.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")}`
        : "Emergent Paradigms in Modern Applied Computational Sciences";

      const activeUser = currentUser || username || "guest";
      const displayName = typeof activeUser === "object" ? (activeUser.fullName || activeUser.email || "Primary Researcher") : (activeUser || "Primary Researcher");
      const userEmail = typeof activeUser === "object" ? (activeUser.email || "") : (typeof activeUser === "string" && activeUser.includes("@") ? activeUser : "");

      const newDoc = generateFullPaper({
        prompt: defaultTopic,
        pageCount: Number(pageCount) || 25,
        citationStyle,
        citationLevel,
        language: docLang,
        selectedDatabases: ["Semantic Scholar", "PubMed", "arXiv", "Crossref"],
        username: displayName
      });

      // Save to active user repository (and guest repository if not logged in yet)
      try {
        const existingDocs = getUserDocs(activeUser);
        const updatedDocs = [newDoc, ...existingDocs.filter(d => d.id !== newDoc.id)];
        saveUserDocs(activeUser, updatedDocs);
        incrementUserPdfCount(activeUser);

        // If user has email or is registered, sync to SQL backend directly
        if (userEmail) {
          saveResearchPaperToBackend(newDoc, userEmail, displayName);
        }
      } catch (err) {
        console.error("Error saving generated paper to user repository:", err);
      }

      setIsGenerating(false);
      setGenStepText("");

      if (onGeneratedDoc) {
        onGeneratedDoc(newDoc);
      }
    }, 3200);
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <span className="header-brand">
          ¶ <i>ThesisMate</i>
        </span>
        <span>Document #33</span>
        <span className="header-status">
          <span className="status-dot" style={{ color: isGenerating ? "#1b8a5a" : "#b8860b" }}>●</span>{" "}
          {isGenerating ? "Synthesizing..." : "Configuring"}
        </span>
      </div>

      <h3>{t.settingsFormat || "Document settings"}</h3>

      <div className="setting-row">
        <div className="setting-label">
          <span>{t.settingsPageCount || "Number of pages"}</span>
          <span className="badge">{pageCount} ±5</span>
        </div>
        <input
          type="range"
          min="8"
          max="80"
          value={pageCount}
          onChange={(e) => setPageCount(e.target.value)}
          className="range-input"
          disabled={isGenerating}
        />
        <div className="range-labels">
          <span>8</span>
          <span>80</span>
        </div>
      </div>

      {/* Citation Style Dropdown */}
      <div className="setting-row flex-row" style={{ position: "relative" }}>
        <span>{t.settingsCitationStyle || "Citation style"}</span>
        <button
          className="dropdown-btn"
          disabled={isGenerating}
          onClick={() => {
            setIsStyleOpen(!isStyleOpen);
            setIsLevelOpen(false);
            setIsLangOpen(false);
          }}
        >
          <span>{citationStyle}</span>
          <i className={`fa-solid fa-chevron-${isStyleOpen ? "up" : "down"}`}></i>
        </button>
        {isStyleOpen && (
          <div className="dropdown-menu-custom">
            {citationStyles.map((style) => (
              <div
                key={style}
                className="dropdown-item-custom"
                onClick={() => {
                  setCitationStyle(style);
                  setIsStyleOpen(false);
                }}
              >
                {style}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Citation Level Dropdown */}
      <div className="setting-row flex-row" style={{ position: "relative" }}>
        <span>{t.settingsDensity || "Citation density"}</span>
        <button
          className="dropdown-btn"
          disabled={isGenerating}
          onClick={() => {
            setIsLevelOpen(!isLevelOpen);
            setIsStyleOpen(false);
            setIsLangOpen(false);
          }}
        >
          <span>{citationLevel}</span>
          <i className={`fa-solid fa-chevron-${isLevelOpen ? "up" : "down"}`}></i>
        </button>
        {isLevelOpen && (
          <div className="dropdown-menu-custom">
            {citationLevels.map((level) => (
              <div
                key={level}
                className="dropdown-item-custom"
                onClick={() => {
                  setCitationLevel(level);
                  setIsLevelOpen(false);
                }}
              >
                {level}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Language Dropdown */}
      <div className="setting-row flex-row" style={{ position: "relative" }}>
        <span>{t.settingsLanguage || "Document language"}</span>
        <button
          className="dropdown-btn"
          disabled={isGenerating}
          onClick={() => {
            setIsLangOpen(!isLangOpen);
            setIsStyleOpen(false);
            setIsLevelOpen(false);
          }}
        >
          <span>{docLang}</span>
          <i className={`fa-solid fa-chevron-${isLangOpen ? "up" : "down"}`}></i>
        </button>
        {isLangOpen && (
          <div className="dropdown-menu-custom scrollable">
            {documentLanguages.map((langItem) => (
              <div
                key={langItem}
                className="dropdown-item-custom"
                onClick={() => {
                  setDocLang(langItem);
                  setIsLangOpen(false);
                }}
              >
                {langItem}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File / PDF Upload */}
      <label style={{ cursor: "pointer", display: "block", marginTop: "12px", marginBottom: "14px" }}>
        <input type="file" style={{ display: "none" }} onChange={handleFileUpload} disabled={isGenerating} />
        <div className="upload-box">
          <i className="fa-solid fa-arrow-up-from-bracket"></i>
          <span>{uploadedFile ? `Loaded: ${uploadedFile}` : (t.settingsUploadDesc || "Upload source papers (PDF, BibTeX)...")}</span>
        </div>
      </label>

      {/* Generate Now Button */}
      <button
        className="btn-primary"
        onClick={handleGenerateNow}
        disabled={isGenerating}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: "var(--radius-md)",
          fontSize: "1rem",
          fontWeight: "700",
          justifyContent: "center",
          gap: "8px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
          marginBottom: "12px",
          cursor: isGenerating ? "not-allowed" : "pointer"
        }}
      >
        {isGenerating ? (
          <>
            <i className="fa-solid fa-circle-notch fa-spin"></i> {genStepText}
          </>
        ) : (
          <>
            <i className="fa-solid fa-bolt" style={{ color: "var(--support-green)" }}></i> {t.settingsBtnGenerateNow || "Generate Now ⚡"}
          </>
        )}
      </button>

      {/* Live Configuration Status Indicator */}
      <div
        className="settings-card-footer"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "10px",
          borderTop: "1px solid var(--border-color)",
          fontSize: "0.8rem",
          color: "var(--text-muted)"
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="status-dot" style={{ color: "var(--support-green)" }}>●</span>
          <span>{citationStyle} &bull; {citationLevel.split(" ")[0]}</span>
        </span>
        <span style={{ fontWeight: "600", color: "var(--text-main)" }}>
          {pageCount} Pages ({docLang})
        </span>
      </div>
    </div>
  );
}
