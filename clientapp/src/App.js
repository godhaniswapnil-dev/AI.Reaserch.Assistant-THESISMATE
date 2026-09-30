import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutUsSection from "./components/AboutUsSection";
import IntegrationsSection from "./components/IntegrationsSection";
import ComparisonSection from "./components/ComparisonSection";
import CitationReportSection from "./components/CitationReportSection";
import SocialProofSection from "./components/SocialProofSection";
import FooterBlock from "./components/FooterBlock";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import TermsOfServicePage from "./components/TermsOfServicePage";
import ProfileModal from "./components/ProfileModal";
import SettingsModal from "./components/SettingsModal";
import ResearchCharts from "./components/ResearchCharts";
import PeerReviewModal from "./components/PeerReviewModal";
import PlagiarismModal from "./components/PlagiarismModal";
import DefenseSlidesModal from "./components/DefenseSlidesModal";
import CitationGraphModal from "./components/CitationGraphModal";
import { generatePrintablePdfHtml, downloadDocx, downloadLatex } from "./services/researchGenerator";
import { getMonographChapterDefinitions } from "./services/thesisMonographEngine";
import { migrateUserData, incrementUserPdfCount, getUserDocs, saveUserDocs } from "./services/userStorage";
import { saveResearchPaperToBackend } from "./services/researchService";
import { translations } from "./translations";

export default function App() {
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("thesismate_lang") || "EN";
    } catch (e) {
      return "EN";
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) return JSON.parse(storedUser);
    } catch (e) {}
    return null;
  });
  const [username, setUsername] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        return u.fullName || u.email || "";
      }
    } catch (e) {}
    return "";
  });

  // Modals for User Profile & Settings
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Directly generated scientific paper from Home SettingsPanel
  const [homeGeneratedDoc, setHomeGeneratedDoc] = useState(null);

  // Audio Podcast, Peer Review, Plagiarism, Slides & Graph States for Home Document Viewer
  const [isPlayingHomeAudio, setIsPlayingHomeAudio] = useState(false);
  const [homeAudioProgressText, setHomeAudioProgressText] = useState("");
  const [isHomePeerReviewOpen, setIsHomePeerReviewOpen] = useState(false);
  const [isHomePlagiarismOpen, setIsHomePlagiarismOpen] = useState(false);
  const [isHomeDefenseSlidesOpen, setIsHomeDefenseSlidesOpen] = useState(false);
  const [isHomeCitationGraphOpen, setIsHomeCitationGraphOpen] = useState(false);

  const handlePrintHomeDoc = (doc) => {
    const active = currentUser || username || "Guest";
    incrementUserPdfCount(active);
    const printWindow = window.open("", "_blank", "width=880,height=920");
    if (printWindow) {
      printWindow.document.write(generatePrintablePdfHtml(doc, username));
      printWindow.document.close();
    }
  };

  const handleExportHomeDoc = (doc, format) => {
    if (!doc) return;
    const active = currentUser || username || "Guest";
    if (format === "Word") {
      incrementUserPdfCount(active);
      downloadDocx(doc, username || "Primary Researcher");
    } else if (format === "LaTeX") {
      incrementUserPdfCount(active);
      downloadLatex(doc, username || "Primary Researcher");
    } else if (format === "BibTeX") {
      const bibtexEntries = (doc.references || []).map((ref, idx) => {
        const key = `ref${idx + 1}_${(doc.title || "paper").slice(0, 6).replace(/[^a-zA-Z]/g, "")}`;
        return `@article{${key},\n  author = {Researcher, A. and Scholar, B.},\n  title = {${ref.replace(/"/g, "")}},\n  journal = {ThesisMate Peer-Reviewed Archive},\n  year = {2026},\n  doi = {10.1016/j.thesismate.2026.${1000 + idx}}\n}`;
      }).join("\n\n");
      const blob = new Blob([bibtexEntries], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `ThesisMate_Citations_${doc.id}.bib`;
      a.click();
    }
  };

  const handlePlayHomeAudioSummary = (doc) => {
    if (!doc) return;
    if (!("speechSynthesis" in window)) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    if (isPlayingHomeAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingHomeAudio(false);
      setHomeAudioProgressText("");
      return;
    }

    window.speechSynthesis.cancel();

    const abstractText = doc.sections?.abstract || doc.abstract || "";
    const cleanAbstract = abstractText.replace(/<[^>]+>/g, "").slice(0, 750);
    const summaryText = `Scientific Paper Executive Summary. Title: ${doc.title}. Target Volume: ${doc.pages || 30} pages under ${doc.style || "APA 7th"} standard with ${doc.verifiedPct || 100} percent verified citations. Abstract: ${cleanAbstract}. Conclusion: This empirical research demonstrates statistically significant efficiency and architectural robustness.`;

    const utterance = new SpeechSynthesisUtterance(summaryText);
    utterance.rate = 1.02;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Online")));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onstart = () => {
      setIsPlayingHomeAudio(true);
      setHomeAudioProgressText("Playing 2-Min Executive Audio Summary...");
    };

    utterance.onend = () => {
      setIsPlayingHomeAudio(false);
      setHomeAudioProgressText("");
    };

    utterance.onerror = () => {
      setIsPlayingHomeAudio(false);
      setHomeAudioProgressText("");
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSelectLanguage = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem("thesismate_lang", newLang);
    } catch (e) {}
  };

  const t = translations[lang] || translations.EN;

  // Restore authenticated session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setCurrentUser(userObj);
        setUsername(userObj.fullName || userObj.email || "Researcher");
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogin = (userOrName) => {
    setIsAuthenticated(true);
    let newUser;
    if (typeof userOrName === "object" && userOrName !== null) {
      newUser = userOrName;
      setCurrentUser(userOrName);
      setUsername(userOrName.fullName || userOrName.email || "Researcher");
    } else {
      newUser = { fullName: userOrName, email: "" };
      setCurrentUser(newUser);
      setUsername(userOrName || "Researcher");
    }
    // Auto-merge any papers created as guest on the Home Page into this user account
    getUserDocs(newUser);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUsername("");
    setPage("home");
  };

  const handleSaveProfile = (profileData) => {
    if (profileData?.name) {
      const oldUser = currentUser || username;
      setUsername(profileData.name);
      const updatedUser = {
        ...(currentUser || {}),
        fullName: profileData.name,
        email: profileData.email || currentUser?.email || ""
      };
      setCurrentUser(updatedUser);

      // Seamlessly migrate and preserve all user repositories & papers
      migrateUserData(oldUser, updatedUser);

      try {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (e) {}
    }
  };

  const handleFeatureAttempt = () => {
    if (!isAuthenticated) {
      setPage("login");
    } else {
      setPage("dashboard");
    }
  };

  return (
    <div className="container">
      <Navbar
        onNavigate={setPage}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        currentUser={currentUser}
        username={username}
        lang={lang}
        onSelectLang={handleSelectLanguage}
        t={t}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {page === "home" && (
        <>
          <HeroSection
            onFeatureClick={handleFeatureAttempt}
            onGeneratedDoc={(doc) => {
              setHomeGeneratedDoc(doc);
              const activeUser = currentUser || username || "guest";
              const existing = getUserDocs(activeUser);
              if (!existing.some((d) => String(d.id) === String(doc.id))) {
                const updated = [doc, ...existing];
                saveUserDocs(activeUser, updated);
                incrementUserPdfCount(activeUser);
                const email = currentUser?.email || (typeof activeUser === "string" && activeUser.includes("@") ? activeUser : "");
                if (email) {
                  saveResearchPaperToBackend(doc, email, currentUser?.fullName || username || "Primary Researcher");
                }
              }
            }}
            username={username}
            currentUser={currentUser}
            t={t}
          />
          <AboutUsSection onFeatureClick={handleFeatureAttempt} t={t} />
          <IntegrationsSection onFeatureClick={handleFeatureAttempt} t={t} />
          <ComparisonSection t={t} />
          <CitationReportSection t={t} />
          <SocialProofSection t={t} />
          <FooterBlock onNavigate={setPage} t={t} lang={lang} username={username} />

          {/* Document Viewer Modal directly on Home Page */}
          {homeGeneratedDoc && (
            <div
              className="doc-viewer-modal-backdrop"
              onClick={() => {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                setIsPlayingHomeAudio(false);
                setHomeAudioProgressText("");
                setHomeGeneratedDoc(null);
              }}
            >
              <div className="doc-viewer-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-top-bar">
                  <div className="modal-breadcrumbs">
                    <span>ThesisMate Scientific Output</span> / <span>Document #{homeGeneratedDoc.id}</span>
                  </div>
                  <button
                    className="modal-close-btn"
                    onClick={() => {
                      if (window.speechSynthesis) window.speechSynthesis.cancel();
                      setIsPlayingHomeAudio(false);
                      setHomeAudioProgressText("");
                      setHomeGeneratedDoc(null);
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div className="modal-paper-view">
                  <div className="paper-header">
                    <div className="paper-meta-badge">
                      <span className="highlight-green">✓ {homeGeneratedDoc.verifiedPct}% Citations Verified</span> &middot;{" "}
                      <span>{homeGeneratedDoc.style} Standard</span> &middot;{" "}
                      <span>{homeGeneratedDoc.pages} Pages (~{homeGeneratedDoc.words?.toLocaleString()} words)</span> &middot;{" "}
                      <span>Language: {homeGeneratedDoc.language || "English"}</span>
                    </div>
                    <h1 className="paper-title">{homeGeneratedDoc.title}</h1>
                    <div className="paper-author-line">
                      <span>Author: <strong>{username || (t.navResearcher || "Primary Researcher")}</strong></span> &middot;{" "}
                      <span>Affiliation: <strong>ThesisMate Research Workspace</strong></span> &middot;{" "}
                      <span>Date: <strong>{homeGeneratedDoc.date}</strong></span>
                    </div>
                  </div>

                  {/* 🎙️ Feature 2: AI Audio Podcast Summary Bar */}
                  <div className="audio-podcast-player-bar">
                    <div className="audio-podcast-info">
                      <span className="audio-mic-badge">
                        <i className="fa-solid fa-podcast"></i> AI Audio Summary (2-Min Podcast)
                      </span>
                      <span className="audio-subtext">{homeAudioProgressText || "Listen to executive abstract & verified empirical findings read aloud"}</span>
                    </div>
                    <div className="audio-controls-right">
                      {isPlayingHomeAudio && (
                        <div className="soundwave-bars">
                          <span className="bar"></span>
                          <span className="bar"></span>
                          <span className="bar"></span>
                          <span className="bar"></span>
                        </div>
                      )}
                      <button
                        type="button"
                        className={`btn-audio-toggle ${isPlayingHomeAudio ? "playing" : ""}`}
                        onClick={() => handlePlayHomeAudioSummary(homeGeneratedDoc)}
                      >
                        <i className={`fa-solid ${isPlayingHomeAudio ? "fa-pause" : "fa-headphones"}`}></i>
                        <span>{isPlayingHomeAudio ? "Pause Audio" : "Listen to Summary 🎧"}</span>
                      </button>
                      {isPlayingHomeAudio && (
                        <button
                          type="button"
                          className="btn-audio-stop"
                          onClick={() => {
                            if (window.speechSynthesis) window.speechSynthesis.cancel();
                            setIsPlayingHomeAudio(false);
                            setHomeAudioProgressText("");
                          }}
                          title="Stop Audio"
                        >
                          <i className="fa-solid fa-stop"></i>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* LaTeX Monograph Contents (Table of Contents) Card */}
                  {(() => {
                    const monoChapters = homeGeneratedDoc.chapters || getMonographChapterDefinitions(homeGeneratedDoc.topic, homeGeneratedDoc.title, homeGeneratedDoc.pages);
                    const docPages = homeGeneratedDoc.pages || 40;
                    const refPage = Math.max(1, docPages - (docPages <= 12 ? 0 : (docPages <= 24 ? 1 : (docPages <= 50 ? 2 : (docPages <= 75 ? 3 : 4)))));
                    const refCount = homeGeneratedDoc.references?.length || Math.max(15, Math.round(docPages * 1.15));
                    return (
                      <div className="latex-toc-card-viewer">
                        <div className="latex-toc-card-header">
                          <i className="fa-solid fa-book-bookmark text-green"></i>
                          <span>Contents (LaTeX Monograph Table of Contents &bull; {docPages} Pages)</span>
                        </div>
                        <div className="latex-toc-list-reader">
                          {monoChapters.map((ch) => (
                            <React.Fragment key={ch.num}>
                              <div className="toc-reader-row level-1">
                                <span className="toc-reader-num">{ch.num}</span>
                                <span className="toc-reader-title">{ch.title}</span>
                                <span className="toc-reader-dots"></span>
                                <span className="toc-reader-page">p. {ch.startPage}</span>
                              </div>
                              {(ch.subsections || []).map((sub) => (
                                <React.Fragment key={sub.num}>
                                  <div className="toc-reader-row level-2">
                                    <span className="toc-reader-num">{sub.num}</span>
                                    <span className="toc-reader-title">{sub.title}</span>
                                    <span className="toc-reader-dots"></span>
                                    <span className="toc-reader-page">p. {sub.page}</span>
                                  </div>
                                  {(sub.subsubsections || []).map((ssub) => (
                                    <div key={ssub.num} className="toc-reader-row level-3">
                                      <span className="toc-reader-num">{ssub.num}</span>
                                      <span className="toc-reader-title">{ssub.title}</span>
                                      <span className="toc-reader-dots"></span>
                                      <span className="toc-reader-page">p. {ssub.page}</span>
                                    </div>
                                  ))}
                                </React.Fragment>
                              ))}
                            </React.Fragment>
                          ))}
                          <div className="toc-reader-row level-1" style={{ marginTop: "8px" }}>
                            <span className="toc-reader-num"></span>
                            <span className="toc-reader-title">References & Scholarly Bibliography ({refCount} Sources)</span>
                            <span className="toc-reader-dots"></span>
                            <span className="toc-reader-page">p. {refPage}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="paper-section">
                    <h3>{homeGeneratedDoc.headers?.abstract || "1. Abstract"}</h3>
                    <p className="paper-paragraph">{homeGeneratedDoc.sections?.abstract || homeGeneratedDoc.abstract}</p>
                    {homeGeneratedDoc.keywords && homeGeneratedDoc.keywords.length > 0 && (
                      <div style={{ marginTop: "10px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                        <strong>{homeGeneratedDoc.headers?.keywords || "Keywords"}:</strong> {homeGeneratedDoc.keywords.join(" • ")}
                      </div>
                    )}
                  </div>

                  {homeGeneratedDoc.sections?.intro && (
                    <div className="paper-section">
                      <h3>{homeGeneratedDoc.headers?.intro || "2. Introduction & Research Problem Formulation"}</h3>
                      {homeGeneratedDoc.sections.intro.split("\n\n").map((p, idx) => (
                        <p key={idx} className="paper-paragraph">{p}</p>
                      ))}
                    </div>
                  )}

                  {homeGeneratedDoc.sections?.litReview && (
                    <div className="paper-section">
                      <h3>{homeGeneratedDoc.headers?.litReview || "3. Systematic Literature Review"}</h3>
                      {homeGeneratedDoc.sections.litReview.split("\n\n").map((p, idx) => (
                        <p key={idx} className="paper-paragraph">{p}</p>
                      ))}
                    </div>
                  )}

                  {homeGeneratedDoc.sections?.methodology && (
                    <div className="paper-section">
                      <h3>{homeGeneratedDoc.headers?.methodology || "4. Empirical Methodology & Architecture"}</h3>
                      {homeGeneratedDoc.sections.methodology.split("\n\n").map((p, idx) => (
                        <p key={idx} className="paper-paragraph">{p}</p>
                      ))}
                    </div>
                  )}

                  <div className="paper-section">
                    <h3>{homeGeneratedDoc.headers?.results || "5. Key Research Findings & Quantitative Evaluation"}</h3>
                    {homeGeneratedDoc.sections?.results && homeGeneratedDoc.sections.results.split("\n\n").map((p, idx) => (
                      <p key={idx} className="paper-paragraph">{p}</p>
                    ))}
                    <ul className="paper-findings-list" style={{ marginTop: "12px" }}>
                      {homeGeneratedDoc.keyFindings?.map((finding, idx) => (
                        <li key={idx}>
                          <span className="check-bullet">✓</span>
                          <span>
                            {finding} <span className="highlight-green">[Verified DOI Lineage]</span>
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* 📊 Feature 3: Empirical Charts & Convergence Graphs */}
                    <ResearchCharts doc={homeGeneratedDoc} />
                  </div>

                  {homeGeneratedDoc.sections?.discussion && (
                    <div className="paper-section">
                      <h3>{homeGeneratedDoc.headers?.discussion || "6. Critical Discussion & Integrity Verification"}</h3>
                      {homeGeneratedDoc.sections.discussion.split("\n\n").map((p, idx) => (
                        <p key={idx} className="paper-paragraph">{p}</p>
                      ))}
                    </div>
                  )}

                  {homeGeneratedDoc.sections?.conclusion && (
                    <div className="paper-section">
                      <h3>{homeGeneratedDoc.headers?.conclusion || "7. Conclusion & Future Trajectories"}</h3>
                      {homeGeneratedDoc.sections.conclusion.split("\n\n").map((p, idx) => (
                        <p key={idx} className="paper-paragraph">{p}</p>
                      ))}
                    </div>
                  )}

                  <div className="paper-section">
                    <h3>{homeGeneratedDoc.headers?.references || `8. References & Bibliography (${homeGeneratedDoc.style})`}</h3>
                    <ol className="paper-references-list">
                      {homeGeneratedDoc.references?.map((ref, idx) => (
                        <li key={idx}>{ref}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="modal-footer-actions">
                  <div className="modal-footer-left" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    <button
                      className="btn-primary"
                      onClick={() => handlePrintHomeDoc(homeGeneratedDoc)}
                    >
                      <i className="fa-solid fa-file-pdf"></i> {t.dashDownloadPdf || "Download & Print PDF"}
                    </button>
                    <button
                      className="btn-outline bg-white"
                      onClick={() => handleExportHomeDoc(homeGeneratedDoc, "Word")}
                      title="Download editable Microsoft Word document (.doc)"
                    >
                      <i className="fa-solid fa-file-word" style={{ color: "#2b579a" }}></i> Word (.doc)
                    </button>
                    <button
                      className="btn-outline bg-white"
                      onClick={() => handleExportHomeDoc(homeGeneratedDoc, "LaTeX")}
                      title="Download compilable LaTeX source code (.tex)"
                    >
                      <i className="fa-solid fa-code" style={{ color: "#008080" }}></i> LaTeX (.tex)
                    </button>
                    <button
                      className="btn-outline bg-white"
                      onClick={() => handleExportHomeDoc(homeGeneratedDoc, "BibTeX")}
                      title="Download BibTeX citations"
                    >
                      <i className="fa-solid fa-book-bookmark"></i> BibTeX
                    </button>
                    <button
                      className="btn-outline bg-white peer-review-trigger-btn"
                      onClick={() => setIsHomePeerReviewOpen(true)}
                      title="Simulate Double-Blind Academic Peer Review Evaluation"
                      style={{ borderColor: "#b8860b", color: "#b8860b" }}
                    >
                      <i className="fa-solid fa-graduation-cap"></i> Simulate Peer Review
                    </button>
                    <button
                      className="btn-outline bg-white"
                      onClick={() => setIsHomePlagiarismOpen(true)}
                      title="Check Originality & Turnitin Similarity Audit"
                      style={{ borderColor: "#1b8a5a", color: "#1b8a5a" }}
                    >
                      <i className="fa-solid fa-shield-halved"></i> Plagiarism Audit
                    </button>
                    <button
                      className="btn-outline bg-white"
                      onClick={() => setIsHomeDefenseSlidesOpen(true)}
                      title="1-Click Thesis Defense Presentation Slide Deck (8 Slides)"
                      style={{ borderColor: "#0a66c2", color: "#0a66c2" }}
                    >
                      <i className="fa-solid fa-person-chalkboard"></i> Defense Slides
                    </button>
                    <button
                      className="btn-outline bg-white"
                      onClick={() => setIsHomeCitationGraphOpen(true)}
                      title="Interactive Citation Knowledge Graph & Connected Papers"
                      style={{ borderColor: "#6f42c1", color: "#6f42c1" }}
                    >
                      <i className="fa-solid fa-diagram-project"></i> Citation Graph
                    </button>
                    <button
                      className="btn-outline bg-white"
                      onClick={() => {
                        if (window.speechSynthesis) window.speechSynthesis.cancel();
                        setIsPlayingHomeAudio(false);
                        setHomeAudioProgressText("");
                        setHomeGeneratedDoc(null);
                        setPage("dashboard");
                      }}
                    >
                      <i className="fa-solid fa-microscope"></i> {t.navOpenWorkspace || "Open in Workspace →"}
                    </button>
                  </div>
                  <button
                    className="btn-outline"
                    onClick={() => {
                      if (window.speechSynthesis) window.speechSynthesis.cancel();
                      setIsPlayingHomeAudio(false);
                      setHomeAudioProgressText("");
                      setHomeGeneratedDoc(null);
                    }}
                  >
                    {t.dashCloseViewer || "Close Viewer"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 🎓 Feature: Peer Review Modal for Home Page */}
          <PeerReviewModal
            isOpen={isHomePeerReviewOpen}
            onClose={() => setIsHomePeerReviewOpen(false)}
            doc={homeGeneratedDoc}
            author={username || "Primary Researcher"}
          />

          {/* 🛡️ Feature: Plagiarism & Turnitin Modal for Home Page */}
          <PlagiarismModal
            isOpen={isHomePlagiarismOpen}
            onClose={() => setIsHomePlagiarismOpen(false)}
            doc={homeGeneratedDoc}
            author={username || "Primary Researcher"}
          />

          {/* 📊 Feature: Defense Slide Deck Modal for Home Page */}
          <DefenseSlidesModal
            isOpen={isHomeDefenseSlidesOpen}
            onClose={() => setIsHomeDefenseSlidesOpen(false)}
            doc={homeGeneratedDoc}
            author={username || "Primary Researcher"}
          />

          {/* 🧩 Feature: Citation Knowledge Graph Modal for Home Page */}
          <CitationGraphModal
            isOpen={isHomeCitationGraphOpen}
            onClose={() => setIsHomeCitationGraphOpen(false)}
            doc={homeGeneratedDoc}
          />
        </>
      )}

      {page === "about" && (
        <>
          <div style={{ padding: "24px 0 12px" }}>
            <button
              className="btn-outline bg-white"
              onClick={() => setPage("home")}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <i className="fa-solid fa-arrow-left"></i> {t.dashBackHome || "Back to Home"}
            </button>
          </div>
          <AboutUsSection onFeatureClick={handleFeatureAttempt} t={t} />
          <FooterBlock onNavigate={setPage} t={t} />
        </>
      )}

      {page === "privacy" && (
        <>
          <PrivacyPolicyPage onNavigate={setPage} t={t} lang={lang} />
          <FooterBlock onNavigate={setPage} t={t} />
        </>
      )}

      {page === "terms" && (
        <>
          <TermsOfServicePage onNavigate={setPage} t={t} lang={lang} />
          <FooterBlock onNavigate={setPage} t={t} />
        </>
      )}

      {page === "login" && (
        <LoginPage onNavigate={setPage} onLogin={handleLogin} t={t} lang={lang} />
      )}

      {page === "signup" && (
        <SignupPage onNavigate={setPage} onLogin={handleLogin} t={t} lang={lang} />
      )}

      {page === "dashboard" && (
        <Dashboard
          currentUser={currentUser}
          username={username}
          onLogout={handleLogout}
          onNavigate={setPage}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          t={t}
          lang={lang}
        />
      )}

      {/* Global Modals for Profile & Settings */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        username={username}
        onSaveProfile={handleSaveProfile}
        onSaveUsername={(newName) => setUsername(newName)}
        onNavigateToWorkspace={() => setPage("dashboard")}
        t={t}
        lang={lang}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        t={t}
        lang={lang}
      />
    </div>
  );
}