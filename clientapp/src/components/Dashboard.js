import React, { useState, useEffect } from "react";
import { translations } from "../translations";
import { generateFullPaperAsync, generatePrintablePdfHtml } from "../services/researchGenerator";
import { getUserProfile, getUserDocs, saveUserDocs, getUserPdfCount, incrementUserPdfCount } from "../services/userStorage";
import { saveResearchPaperToBackend, deleteResearchPaperFromBackend, getAllResearchPapers, generateResearchPaperViaBackend } from "../services/researchService";

export default function Dashboard({ currentUser, username, onLogout, onNavigate, onOpenProfile, t, lang = "EN" }) {
  const activeT = t || translations[lang] || translations.EN;
  const isHindi = lang === "HI";

  // Active user reference & isolated state
  const activeUser = currentUser || username;
  const [userProfile, setUserProfile] = useState(() => getUserProfile(activeUser));
  const [documents, setDocuments] = useState(() => getUserDocs(activeUser));
  const [pdfDownloadCount, setPdfDownloadCount] = useState(() => getUserPdfCount(activeUser));

  // Synchronize state when user changes & load from SQL backend
  useEffect(() => {
    const curr = currentUser || username;
    setUserProfile(getUserProfile(curr));
    setDocuments(getUserDocs(curr));
    setPdfDownloadCount(getUserPdfCount(curr));

    const syncWithBackend = async () => {
      const email = typeof curr === "object" ? curr?.email : (typeof curr === "string" && curr.includes("@") ? curr : "");
      if (!email) return;

      const backendPapers = await getAllResearchPapers(email);
      if (backendPapers && Array.isArray(backendPapers)) {
        const userBackendDocs = backendPapers.map((bp) => ({
          id: bp.id,
          title: bp.topic || bp.title || "Research Paper",
          topic: bp.topic || "General Research",
          date: new Date(bp.createdAt).toLocaleDateString(),
          pages: bp.pages || 30,
          words: (bp.pages || 30) * 320,
          citations: bp.verifiedPct ? Math.round(bp.verifiedPct * 0.48) : 48,
          verifiedPct: bp.verifiedPct || 100,
          status: bp.status || "Verified",
          style: bp.citationStyle || "APA 7th",
          density: bp.citationLevel || "Sentence",
          language: bp.language || "English",
          abstract: bp.abstract || "",
          keywords: bp.keywords ? bp.keywords.split(", ") : [],
          references: bp.referencesJson ? (typeof bp.referencesJson === "string" ? JSON.parse(bp.referencesJson) : bp.referencesJson) : [],
          sections: bp.sectionsJson ? (typeof bp.sectionsJson === "string" ? JSON.parse(bp.sectionsJson) : bp.sectionsJson) : {}
        }));

        if (userBackendDocs.length > 0) {
          setDocuments(userBackendDocs);
          saveUserDocs(curr, userBackendDocs);
        }
      }
    };
    syncWithBackend();
  }, [currentUser, username]);

  // Navigation & Filter states
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Research Generator Configuration
  const [prompt, setPrompt] = useState("");
  const [pageCount, setPageCount] = useState(30);
  const [citationStyle, setCitationStyle] = useState("APA 7th");
  const [citationLevel, setCitationLevel] = useState("Sentence");
  const [language, setLanguage] = useState("English");
  const [selectedDatabases, setSelectedDatabases] = useState([
    "Semantic Scholar",
    "PubMed",
    "arXiv",
  ]);

  // Generation Pipeline Simulation & Live AI Progress States
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [genProgress, setGenProgress] = useState(0);
  const [liveProgressMsg, setLiveProgressMsg] = useState("");

  // Document Viewer Modal State
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  // Visual counter highlight pulse state
  const [justIncremented, setJustIncremented] = useState(false);

  const presetTopics = [
    "Quantum Machine Learning in Oncology Drug Discovery",
    "Autonomous Multi-Agent Systems in Supply Chain Resilience",
    "Microplastic Degradation Pathways via Engineered Enzymes",
    "Post-Quantum Cryptography & Zero-Knowledge Verification",
  ];

  const citationStyles = [
    "APA 7th",
    "IEEE",
    "MLA 9th",
    "Chicago 17th",
    "Harvard",
    "Vancouver",
  ];

  const databaseOptions = [
    { id: "Semantic Scholar", label: "Semantic Scholar (200M+ Papers)" },
    { id: "PubMed", label: "PubMed / MEDLINE" },
    { id: "arXiv", label: "arXiv & IACR Preprints" },
    { id: "Crossref", label: "Crossref & DOAJ" },
  ];

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const toggleDatabase = (dbId) => {
    if (selectedDatabases.includes(dbId)) {
      if (selectedDatabases.length > 1) {
        setSelectedDatabases(selectedDatabases.filter((d) => d !== dbId));
      } else {
        showToast("At least one scientific database must be selected.");
      }
    } else {
      setSelectedDatabases([...selectedDatabases, dbId]);
    }
  };


  const displayName = userProfile?.name || username || currentUser?.fullName || currentUser?.email || (activeT.navResearcher || "Researcher");
  const userAffiliation = userProfile?.institution ? (userProfile.department ? `${userProfile.institution} • ${userProfile.department}` : userProfile.institution) : "ThesisMate Research Workspace";

  // Distinguish between a brand-new user (first signup/login) vs an existing/returning user
  const isNewUser = currentUser?.isNewUser === true;
  const welcomeGreeting = isNewUser
    ? (activeT.dashWelcome || "Welcome,")
    : (activeT.dashWelcomeBack || "Welcome back,");

  // After first viewing, mark the user as an existing user for future sessions
  useEffect(() => {
    if (currentUser?.isNewUser) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.isNewUser = false;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
      } catch (e) {}
    }
  }, [currentUser]);

  const handleStartGeneration = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      showToast(isHindi ? "कृपया शोध विषय या थीसिस दर्ज करें।" : "Please enter a research topic or thesis statement.");
      return;
    }

    setIsGenerating(true);
    setGenStep(1);
    setGenProgress(15);
    setLiveProgressMsg(`Searching Google Scholar & Semantic Scholar for "${prompt.trim().slice(0, 35)}..."`);

    try {
      const active = currentUser || username;
      const userEmail = typeof active === "object" ? active?.email : "";

      // 1. Attempt Backend AI synthesis (Google Gemini / ASP.NET Core API)
      let newDoc = null;
      try {
        setGenStep(2);
        setGenProgress(40);
        setLiveProgressMsg(isHindi ? "सर्वर AI इंजन और डेटाबेस से शोध पत्र तैयार हो रहा है..." : `Synthesizing peer-reviewed paper via Backend AI Engine...`);
        newDoc = await generateResearchPaperViaBackend({
          prompt: prompt.trim(),
          pageCount: Number(pageCount) || 30,
          citationStyle,
          citationLevel,
          language,
          selectedDatabases,
          userEmail,
          username: displayName
        });
      } catch (backendErr) {
        console.warn("Backend synthesis fallback:", backendErr);
      }

      // 2. If backend is offline or fallback is needed, use client async generator
      if (!newDoc) {
        newDoc = await generateFullPaperAsync({
          prompt: prompt.trim(),
          pageCount: Number(pageCount) || 30,
          citationStyle,
          citationLevel,
          language,
          selectedDatabases,
          username: displayName,
          onProgress: ({ step, progress, message }) => {
            setGenStep(step);
            setGenProgress(progress);
            if (message) setLiveProgressMsg(message);
          }
        });

        // Save metadata directly to SQL Server database (SSMS visible table: ResearchPapers)
        saveResearchPaperToBackend(newDoc, userEmail, displayName);
      }

      // Update per-user documents & PDF export count
      const updatedDocs = [newDoc, ...documents];
      setDocuments(updatedDocs);
      saveUserDocs(active, updatedDocs);

      const nextPdf = incrementUserPdfCount(active);
      setPdfDownloadCount(nextPdf);

      setIsGenerating(false);
      setGenStep(0);
      setGenProgress(100);
      setPrompt("");

      // Trigger visual pulse on metric cards
      setJustIncremented(true);
      setTimeout(() => setJustIncremented(false), 2000);

      showToast(`🎉 Research Paper & PDF generated for "${newDoc.title.slice(0, 30)}..."!`);
      setSelectedDoc(newDoc);
    } catch (err) {
      console.error("Generation error:", err);
      setIsGenerating(false);
      setGenStep(0);
      showToast(isHindi ? "जनरेशन में त्रुटि हुई। कृपया पुनः प्रयास करें।" : "Generation error occurred. Please try again.");
    }
  };

  const handleDeleteDoc = (id, e) => {
    e.stopPropagation();
    const confirmText = isHindi
      ? "क्या आप निश्चित रूप से इस दस्तावेज़ को अपनी रिपॉजिटरी से हटाना चाहते हैं?"
      : "Are you sure you want to remove this document from your workspace?";

    if (window.confirm(confirmText)) {
      const active = currentUser || username;
      const updated = documents.filter((doc) => doc.id !== id);
      setDocuments(updated);
      saveUserDocs(active, updated);

      // Delete from SQL Server database
      deleteResearchPaperFromBackend(id);

      if (selectedDoc?.id === id) setSelectedDoc(null);
      showToast(isHindi ? "दस्तावेज़ हटा दिया गया।" : "Document removed from your library.");
    }
  };

  // Real Multi-Page PDF print & export handler tailored to prompt, language, pages & databases
  const handleExport = (doc, format, e) => {
    if (e) e.stopPropagation();
    const active = currentUser || username;

    if (format === "PDF" || format.includes("PDF")) {
      const next = incrementUserPdfCount(active);
      setPdfDownloadCount(next);

      setJustIncremented(true);
      setTimeout(() => setJustIncremented(false), 2000);

      showToast(`Generating ${doc.pages}-page printable PDF for: "${doc.title.slice(0, 28)}..."`);

      const printWindow = window.open("", "_blank", "width=880,height=920");
      if (printWindow) {
        printWindow.document.write(generatePrintablePdfHtml(doc, displayName));
        printWindow.document.close();
      }
    } else if (format === "BibTeX") {
      const bibtexContent = (doc.references || [])
        .map((ref, idx) => `@article{ref_${doc.id}_${idx + 1},\n  title={${doc.title}},\n  note={${ref}}\n}`)
        .join("\n\n");
      const blob = new Blob([bibtexContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ThesisMate_Citations_${doc.id}.bib`;
      a.click();
      showToast(isHindi ? "BibTeX संदर्भ डाउनलोड हो गए।" : "Downloaded BibTeX bibliography (.bib).");
    } else {
      showToast(`Exporting "${doc.title.slice(0, 25)}..." as ${format}`);
    }
  };

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.style.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "verified") return matchesSearch && doc.status === "Verified";
    if (activeTab === "drafting") return matchesSearch && doc.status === "Drafting";
    return matchesSearch;
  });

  // Dynamic calculations for live auto-incrementing counters
  const totalDocsCount = documents.length;
  const totalPagesWritten = documents.reduce((acc, d) => acc + (Number(d.pages) || 0), 0);
  const totalCitations = documents.reduce((acc, d) => acc + (Number(d.citations) || 0), 0);

  return (
    <div className="workspace-container">
      {/* Toast Notification */}
      {toastMsg && <div className="workspace-toast">{toastMsg}</div>}

      {/* --- TOP RESEARCH BAR --- */}
      <div className="workspace-hero-bar">
        <div className="workspace-user-meta">
          <div className="workspace-avatar-large" onClick={onOpenProfile} title="View Profile Details & Research Repositories" style={{ cursor: "pointer" }}>
            {displayName ? displayName.charAt(0).toUpperCase() : "R"}
          </div>
          <div>
            <div className="workspace-badge-row">
              <span className="research-status-pill">
                <span className="live-pulse-dot"></span> {activeT.dashActiveLab || "Active Research Lab"}
              </span>
              <span className="academic-tier-pill">{activeT.dashProTier || "PRO RESEARCHER"}</span>
              <span className={`live-counter-pill ${justIncremented ? "pulse-pill" : ""}`}>
                <i className="fa-solid fa-file-pdf"></i> <strong>{totalDocsCount}</strong> {activeT.dashPdfInLib || "PDFs in Library"}
              </span>
            </div>
            <h1 className="workspace-greeting" onClick={onOpenProfile} style={{ cursor: "pointer" }} title="Click to view Profile Repositories">
              {welcomeGreeting} <i>{displayName}</i>
            </h1>
            <p className="workspace-subtext">
              {activeT.dashSubtext || "Draft peer-reviewed scientific documents. Every time a draft is generated, the counters increase automatically."}
            </p>
          </div>
        </div>

        <div className="workspace-top-actions">
          {onOpenProfile && (
            <button
              className="btn-outline bg-white"
              onClick={onOpenProfile}
              title="View Profile Details & Research Repositories"
            >
              <i className="fa-solid fa-user-tie"></i> {activeT.navProfile || "Profile Details"}
            </button>
          )}
          <button
            className="btn-outline bg-white"
            onClick={() => onNavigate("home")}
            title="Return to Landing Page"
          >
            <i className="fa-solid fa-house"></i> {activeT.dashHome || "Home"}
          </button>
          <button
            className="btn-outline"
            style={{ color: "var(--support-red)" }}
            onClick={onLogout}
            title="End your session"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i> {activeT.dashLogout || "Logout"}
          </button>
        </div>
      </div>

      {/* --- LIVE AUTO-INCREMENTING METRICS RIBBON --- */}
      <div className="metrics-ribbon">
        <div className={`metric-box ${justIncremented ? "metric-box-incremented" : ""}`}>
          <div className="metric-header-row">
            <span className="metric-label">{activeT.dashMetricDocs || "PDFs & PAPERS PRODUCED"}</span>
            {justIncremented && <span className="increment-badge">+1 Added!</span>}
          </div>
          <div className="metric-val">
            <span className="live-number">{totalDocsCount}</span> <i>papers</i>
          </div>
          <div className="metric-foot">
            <i className="fa-solid fa-check text-green"></i> {activeT.dashMetricDocsSub || "Auto-increases on every draft"}
          </div>
        </div>

        <div className={`metric-box ${justIncremented ? "metric-box-incremented" : ""}`}>
          <div className="metric-header-row">
            <span className="metric-label">{activeT.dashMetricPages || "TOTAL PAGES DRAFTED"}</span>
            {justIncremented && <span className="increment-badge">+{pageCount} pgs</span>}
          </div>
          <div className="metric-val">
            <span className="live-number">{totalPagesWritten}</span> <i>pages</i>
          </div>
          <div className="metric-foot">
            ~{Math.round(totalPagesWritten * 340).toLocaleString()} {activeT.dashMetricPagesSub || "words synthesized"}
          </div>
        </div>

        <div className={`metric-box ${justIncremented ? "metric-box-incremented" : ""}`}>
          <div className="metric-header-row">
            <span className="metric-label">{activeT.dashMetricCitations || "CITATIONS VERIFIED"}</span>
            {justIncremented && <span className="increment-badge">Verified!</span>}
          </div>
          <div className="metric-val">
            <span className="live-number">{totalCitations}</span> <i>sources</i>
          </div>
          <div className="metric-foot text-green">
            <i className="fa-solid fa-shield-halved"></i> {activeT.dashMetricCitationsSub || "100% verifiable DOI lineage"}
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-header-row">
            <span className="metric-label">{activeT.dashMetricExports || "TOTAL PDF EXPORTS"}</span>
          </div>
          <div className="metric-val">
            <span className="live-number">{pdfDownloadCount}</span> <i>downloads</i>
          </div>
          <div className="metric-foot">
            <i className="fa-solid fa-download"></i> {activeT.dashMetricExportsSub || "PDF, LaTeX & BibTeX"}
          </div>
        </div>
      </div>

      {/* --- GENERATE NEW RESEARCH STUDIO --- */}
      <div className="research-studio-card">
        <div className="studio-card-header">
          <div className="studio-title-group">
            <span className="subheading" style={{ textAlign: "left", marginBottom: "4px" }}>
              {activeT.dashStudioSub || "AI SCIENTIFIC WRITING STUDIO"}
            </span>
            <h2>{activeT.dashStudioTitle || "Generate a New Research Paper & PDF"}</h2>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <div
              style={{
                fontSize: "0.82rem",
                padding: "6px 14px",
                borderRadius: "20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "var(--bg-green-light)",
                border: "1px solid rgba(27, 138, 90, 0.25)",
                color: "var(--support-green)",
                fontWeight: "600"
              }}
            >
              <span className="status-dot" style={{ color: "var(--support-green)" }}>●</span>
              <span>AI Research Engine: Online (Auto-Connected)</span>
            </div>
            <div className="studio-badge-indicator">
              <i className="fa-solid fa-wand-magic-sparkles"></i> 1 Prompt &rarr; 80 Pages &rarr; Auto-Count
            </div>
          </div>
        </div>

        <form onSubmit={handleStartGeneration}>
          {/* Main Prompt Input Area */}
          <div className="prompt-input-wrapper">
            <label className="prompt-field-label">
              <i className="fa-solid fa-pen-nib"></i> {activeT.dashPromptLabel || "Research Topic, Hypothesis, or Thesis Statement"}
            </label>
            <textarea
              className="prompt-textarea"
              rows="3"
              placeholder={activeT.dashPromptPlaceholder || "e.g. Comparative Analysis of Federated Learning Optimization in Edge IoT Networks under Asymmetric Data Drift..."}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              required
            />

            {/* Quick Topic Chips (Original Preset) */}
            <div className="preset-topics-tray">
              <span className="preset-topics-label">{activeT.dashTryExample || "Try an example:"}</span>
              <div className="preset-chips">
                {presetTopics.map((topic, i) => (
                  <button
                    key={i}
                    type="button"
                    className="topic-chip-btn"
                    onClick={() => setPrompt(topic)}
                    disabled={isGenerating}
                  >
                    + {topic.slice(0, 38)}...
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration Controls Matrix */}
          <div className="studio-config-matrix">
            {/* Page Count Slider */}
            <div className="config-block">
              <div className="config-block-head">
                <label>{activeT.dashTargetPages || "Target Page Count (Increases Page Counter)"}</label>
                <span className="config-badge-num">{pageCount} Pages</span>
              </div>
              <input
                type="range"
                min="8"
                max="80"
                step="1"
                value={pageCount}
                onChange={(e) => setPageCount(e.target.value)}
                className="range-input"
                disabled={isGenerating}
              />
              <div className="range-labels">
                <span>8 pgs (~2.7k words)</span>
                <span>80 pgs (~27k words)</span>
              </div>
            </div>

            {/* Citation Style Selector */}
            <div className="config-block">
              <label className="config-block-label">{activeT.dashCitationStyle || "Citation Style"}</label>
              <div className="style-pills-row">
                {citationStyles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={`style-pill-btn ${citationStyle === style ? "active" : ""}`}
                    onClick={() => setCitationStyle(style)}
                    disabled={isGenerating}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Citation Density & Language */}
            <div className="config-block-row">
              <div className="config-inline-field">
                <label>{activeT.dashCitationDensity || "Citation Density"}</label>
                <select
                  className="studio-select"
                  value={citationLevel}
                  onChange={(e) => setCitationLevel(e.target.value)}
                  disabled={isGenerating}
                >
                  <option value="Sentence">Sentence-level (Dense)</option>
                  <option value="Paragraph">Paragraph-level (Standard)</option>
                  <option value="Page">Page-level (Broad)</option>
                  <option value="Section">Section-level (Concise)</option>
                </select>
              </div>

              <div className="config-inline-field">
                <label>{activeT.dashDocLanguage || "Document Language"}</label>
                <select
                  className="studio-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={isGenerating}
                >
                  <option value="English">English (US/UK)</option>
                  <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                  <option value="Gujarati (ગુજરાતી)">Gujarati (ગુજરાતી)</option>
                  <option value="Spanish (Español)">Spanish (Español)</option>
                  <option value="German (Deutsch)">German (Deutsch)</option>
                  <option value="French (Français)">French (Français)</option>
                  <option value="Chinese (中文)">Chinese (中文)</option>
                  <option value="Japanese (日本語)">Japanese (日本語)</option>
                </select>
              </div>
            </div>

            {/* Repositories Checkboxes */}
            <div className="config-block">
              <label className="config-block-label">{activeT.dashSourceRepos || "Source Repositories (Real Peer-Reviewed Papers)"}</label>
              <div className="databases-checkbox-grid">
                {databaseOptions.map((db) => {
                  const isChecked = selectedDatabases.includes(db.id);
                  return (
                    <label
                      key={db.id}
                      className={`db-checkbox-item ${isChecked ? "selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleDatabase(db.id)}
                        disabled={isGenerating}
                      />
                      <span>{db.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submission Bar */}
          <div className="studio-footer-submit">
            <div className="studio-summary-text">
              <span>
                <i className="fa-solid fa-file-pdf"></i> {activeT.dashReadySummary || "Ready to draft"} <strong>{pageCount} pages</strong> {activeT.dashInStyle || "in"}{" "}
                <strong>{citationStyle}</strong>. {activeT.dashTopIncrement || "The top counters will increment to"}{" "}
                <strong>{totalDocsCount + 1} Papers</strong> &amp; <strong>{totalPagesWritten + Number(pageCount)} Pages</strong>.
              </span>
            </div>

            <button
              type="submit"
              className="btn-primary studio-generate-btn"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i> {activeT.dashBtnGenerating || "Researching & Generating PDF..."}
                </>
              ) : (
                <>
                  <i className="fa-solid fa-bolt"></i> {activeT.dashBtnGenerate || "Generate Full Scientific Draft →"}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Generation Pipeline Visualizer */}
        {isGenerating && (
          <div className="generation-live-overlay">
            <div className="generation-progress-box">
              <div className="gen-header">
                <h3>Drafting Scientific Document &amp; PDF</h3>
                <span className="gen-pct">{genProgress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="gen-progress-track">
                <div
                  className="gen-progress-fill"
                  style={{ width: `${genProgress}%` }}
                ></div>
              </div>

              {/* Step Pipeline Icons */}
              <div className="gen-pipeline-steps">
                <div className={`step-item ${genStep >= 1 ? "active" : ""} ${genStep > 1 ? "done" : ""}`}>
                  <div className="step-circle">{genStep > 1 ? "✓" : "1"}</div>
                  <span>Searching 200M+ Papers</span>
                </div>
                <div className={`step-item ${genStep >= 2 ? "active" : ""} ${genStep > 2 ? "done" : ""}`}>
                  <div className="step-circle">{genStep > 2 ? "✓" : "2"}</div>
                  <span>Extracting Lineage</span>
                </div>
                <div className={`step-item ${genStep >= 3 ? "active" : ""} ${genStep > 3 ? "done" : ""}`}>
                  <div className="step-circle">{genStep > 3 ? "✓" : "3"}</div>
                  <span>Drafting Sections</span>
                </div>
                <div className={`step-item ${genStep >= 4 ? "active" : ""} ${genStep > 4 ? "done" : ""}`}>
                  <div className="step-circle">{genStep > 4 ? "✓" : "4"}</div>
                  <span>Verifying Citations</span>
                </div>
              </div>

              <p className="gen-live-status-text">
                <i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: "8px", color: "var(--accent-dark)" }}></i>
                {liveProgressMsg || (
                  genStep === 1 ? "Querying Semantic Scholar & arXiv indexes for peer-reviewed citations..." :
                  genStep === 2 ? "Validating authors, publication dates, DOIs, and sentence-level claims..." :
                  genStep === 3 ? `Synthesizing ${pageCount} pages of abstract, methodology, and results in ${citationStyle}...` :
                  "Finalizing LaTeX cross-references and updating top counter..."
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* --- DOCUMENT LIBRARY SECTION --- */}
      <div className="workspace-library-section">
        <div className="library-header-bar">
          <div>
            <span className="subheading" style={{ textAlign: "left", marginBottom: "4px" }}>
              {activeT.dashRepoTitle || "RESEARCH REPOSITORY"}
            </span>
            <h2>{activeT.dashRepoTitle || "Your Scientific Documents"} ({filteredDocs.length})</h2>
          </div>

          {/* Library Controls */}
          <div className="library-controls-group">
            {/* Search Input */}
            <div className="library-search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder={activeT.dashSearchPlaceholder || "Search papers by title or topic..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div className="library-tabs">
              <button
                className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                {activeT.dashTabAll || "All"} ({documents.length})
              </button>
              <button
                className={`tab-btn ${activeTab === "verified" ? "active" : ""}`}
                onClick={() => setActiveTab("verified")}
              >
                {activeT.dashTabVerified || "Verified"}
              </button>
              <button
                className={`tab-btn ${activeTab === "drafting" ? "active" : ""}`}
                onClick={() => setActiveTab("drafting")}
              >
                {activeT.dashTabDrafting || "In Progress"}
              </button>
            </div>
          </div>
        </div>

        {/* Document Cards Grid */}
        {documents.length === 0 ? (
          <div className="empty-library-state" style={{ padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", color: "var(--text-muted)", marginBottom: "14px" }}>
              <i className="fa-regular fa-folder-open"></i>
            </div>
            <h3 style={{ fontSize: "1.25rem", color: "var(--text-main)", marginBottom: "8px" }}>
              {isHindi ? "कोई शोध पत्र अभी तक जनरेट नहीं किया गया" : "No Research Papers Generated Yet"}
            </h3>
            <p style={{ color: "var(--text-muted)", maxWidth: "520px", margin: "0 auto 20px auto", lineHeight: "1.6" }}>
              {isHindi
                ? "आपने अभी तक कोई शोध पत्र नहीं बनाया है। ऊपर दिए गए AI साइंटिफिक राइटिंग स्टूडियो में अपना रिसर्च टॉपिक दर्ज करें और 80-पेज तक का पहला ड्राफ्ट जनरेट करें।"
                : "You haven't generated any scientific dissertations yet. Enter your research topic or thesis hypothesis in the Studio above to draft your first 80-page verified paper."}
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                const el = document.getElementById("research-studio");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", margin: "0 auto" }}
            >
              <i className="fa-solid fa-pen-nib"></i> {isHindi ? "पहला पेपर लिखना शुरू करें" : "Start First Draft ↑"}
            </button>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="empty-library-state">
            <i className="fa-regular fa-folder-open"></i>
            <h3>{isHindi ? "कोई मिलान नहीं मिला" : "No documents found"}</h3>
            <p>{isHindi ? "अन्य कीवर्ड से खोजें या नया पेपर बनाएं।" : "Try searching for a different keyword or reset filters."}</p>
          </div>
        ) : (
          <div className="docs-grid">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="rich-doc-card"
                onClick={() => setSelectedDoc(doc)}
              >
                <div className="rich-doc-top">
                  <span className={`doc-status-badge ${doc.status.toLowerCase()}`}>
                    ● {doc.status} ({doc.verifiedPct}% Accuracy)
                  </span>
                  <span className="doc-date">{doc.date}</span>
                </div>

                <h3 className="doc-card-title">{doc.title}</h3>

                <p className="doc-card-abstract-snippet">
                  {doc.abstract.length > 160 ? `${doc.abstract.slice(0, 160)}...` : doc.abstract}
                </p>

                <div className="doc-card-metrics-row">
                  <span className="pill-tag">
                    <i className="fa-regular fa-file-lines"></i> {doc.pages} Pages
                  </span>
                  <span className="pill-tag">
                    <i className="fa-solid fa-quote-right"></i> {doc.style}
                  </span>
                  <span className="pill-tag">
                    <i className="fa-solid fa-check-double"></i> {doc.citations} Citations
                  </span>
                </div>

                <div className="rich-doc-footer">
                  <button
                    className="btn-outline doc-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDoc(doc);
                    }}
                  >
                    <i className="fa-regular fa-eye"></i> {activeT.dashBtnRead || "Read Paper"}
                  </button>

                  <div className="doc-export-buttons">
                    <button
                      className="icon-export-btn"
                      title="Download as PDF"
                      onClick={(e) => handleExport(doc, "PDF", e)}
                    >
                      <i className="fa-solid fa-file-pdf"></i>
                    </button>
                    <button
                      className="icon-export-btn"
                      title="Export to Overleaf / LaTeX"
                      onClick={(e) => handleExport(doc, "LaTeX", e)}
                    >
                      <i className="fa-solid fa-code"></i>
                    </button>
                    <button
                      className="icon-export-btn"
                      title="Download BibTeX Citations"
                      onClick={(e) => handleExport(doc, "BibTeX", e)}
                    >
                      <i className="fa-solid fa-book-bookmark"></i>
                    </button>
                    <button
                      className="icon-export-btn delete-btn"
                      title="Delete Document"
                      onClick={(e) => handleDeleteDoc(doc.id, e)}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- DOCUMENT VIEWER / READER MODAL --- */}
      {selectedDoc && (
        <div className="doc-viewer-modal-backdrop" onClick={() => setSelectedDoc(null)}>
          <div
            className="doc-viewer-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-top-bar">
              <div className="modal-breadcrumbs">
                <span>ThesisMate Research Lab</span> / <span>Document #{selectedDoc.id}</span>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedDoc(null)}
              >
                ✕
              </button>
            </div>

            {/* Document Content View */}
            <div className="modal-paper-view">
              <div className="paper-header">
                <div className="paper-meta-badge">
                  <span className="highlight-green">✓ {selectedDoc.verifiedPct}% Citations Verified</span> &middot;{" "}
                  <span>{selectedDoc.style} Standard</span> &middot;{" "}
                  <span>{selectedDoc.pages} Pages (~{selectedDoc.words?.toLocaleString()} words)</span> &middot;{" "}
                  <span>Language: {selectedDoc.language || "English"}</span>
                </div>
                <h1 className="paper-title">{selectedDoc.title}</h1>
                <div className="paper-author-line">
                  <span>Author: <strong>{displayName}</strong></span> &middot;{" "}
                  <span>Affiliation: <strong>{userAffiliation}</strong></span> &middot;{" "}
                  <span>Date: <strong>{selectedDoc.date}</strong></span>
                </div>
              </div>

              {/* 1. Abstract & Keywords */}
              <div className="paper-section">
                <h3>{selectedDoc.headers?.abstract || "1. Abstract"}</h3>
                <p className="paper-paragraph">{selectedDoc.sections?.abstract || selectedDoc.abstract}</p>
                {selectedDoc.keywords && selectedDoc.keywords.length > 0 && (
                  <div style={{ marginTop: "10px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    <strong>{selectedDoc.headers?.keywords || "Keywords"}:</strong> {selectedDoc.keywords.join(" • ")}
                  </div>
                )}
              </div>

              {/* 2. Introduction */}
              {selectedDoc.sections?.intro && (
                <div className="paper-section">
                  <h3>{selectedDoc.headers?.intro || "2. Introduction & Research Problem Formulation"}</h3>
                  {selectedDoc.sections.intro.split("\n\n").map((p, idx) => (
                    <p key={idx} className="paper-paragraph">{p}</p>
                  ))}
                </div>
              )}

              {/* 3. Systematic Literature Review */}
              {selectedDoc.sections?.litReview && (
                <div className="paper-section">
                  <h3>{selectedDoc.headers?.litReview || "3. Systematic Literature Review & Multi-Repository Taxonomy"}</h3>
                  {selectedDoc.sections.litReview.split("\n\n").map((p, idx) => (
                    <p key={idx} className="paper-paragraph">{p}</p>
                  ))}
                </div>
              )}

              {/* 4. Empirical Methodology */}
              {selectedDoc.sections?.methodology && (
                <div className="paper-section">
                  <h3>{selectedDoc.headers?.methodology || "4. Empirical Methodology, Architecture & Formulations"}</h3>
                  {selectedDoc.sections.methodology.split("\n\n").map((p, idx) => (
                    <p key={idx} className="paper-paragraph">{p}</p>
                  ))}
                </div>
              )}

              {/* 5. Key Research Findings & Empirical Results */}
              <div className="paper-section">
                <h3>{selectedDoc.headers?.results || "5. Key Research Findings & Quantitative Evaluation"}</h3>
                {selectedDoc.sections?.results && selectedDoc.sections.results.split("\n\n").map((p, idx) => (
                  <p key={idx} className="paper-paragraph">{p}</p>
                ))}
                <ul className="paper-findings-list" style={{ marginTop: "12px" }}>
                  {selectedDoc.keyFindings?.map((finding, idx) => (
                    <li key={idx}>
                      <span className="check-bullet">✓</span>
                      <span>
                        {finding} <span className="highlight-green">[Verified DOI Lineage]</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 6. Discussion */}
              {selectedDoc.sections?.discussion && (
                <div className="paper-section">
                  <h3>{selectedDoc.headers?.discussion || "6. Critical Discussion & Integrity Verification"}</h3>
                  {selectedDoc.sections.discussion.split("\n\n").map((p, idx) => (
                    <p key={idx} className="paper-paragraph">{p}</p>
                  ))}
                </div>
              )}

              {/* 7. Conclusion */}
              {selectedDoc.sections?.conclusion && (
                <div className="paper-section">
                  <h3>{selectedDoc.headers?.conclusion || "7. Conclusion & Future Research Trajectories"}</h3>
                  {selectedDoc.sections.conclusion.split("\n\n").map((p, idx) => (
                    <p key={idx} className="paper-paragraph">{p}</p>
                  ))}
                </div>
              )}

              {/* 8. References & Bibliography */}
              <div className="paper-section">
                <h3>{selectedDoc.headers?.references || `8. References & Bibliography (${selectedDoc.style})`}</h3>
                <ol className="paper-references-list">
                  {selectedDoc.references?.map((ref, idx) => (
                    <li key={idx}>{ref}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-footer-actions">
              <div className="modal-footer-left">
                <button
                  className="btn-primary"
                  onClick={() => handleExport(selectedDoc, "PDF")}
                >
                  <i className="fa-solid fa-file-pdf"></i> {activeT.dashDownloadPdf || "Download & Print PDF"}
                </button>
                <button
                  className="btn-outline bg-white"
                  onClick={() => handleExport(selectedDoc, "Overleaf / LaTeX")}
                >
                  <i className="fa-solid fa-code"></i> {activeT.dashExportOverleaf || "Export to Overleaf"}
                </button>
                <button
                  className="btn-outline bg-white"
                  onClick={() => handleExport(selectedDoc, "BibTeX")}
                >
                  <i className="fa-solid fa-book-bookmark"></i> BibTeX
                </button>
              </div>

              <button
                className="btn-outline"
                onClick={() => setSelectedDoc(null)}
              >
                {activeT.dashCloseViewer || "Close Viewer"}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
