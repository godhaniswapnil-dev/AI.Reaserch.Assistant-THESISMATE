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
import { generatePrintablePdfHtml } from "./services/researchGenerator";
import { migrateUserData } from "./services/userStorage";
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

  const handlePrintHomeDoc = (doc) => {
    const printWindow = window.open("", "_blank", "width=880,height=920");
    if (printWindow) {
      printWindow.document.write(generatePrintablePdfHtml(doc, username));
      printWindow.document.close();
    }
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
    if (typeof userOrName === "object" && userOrName !== null) {
      setCurrentUser(userOrName);
      setUsername(userOrName.fullName || userOrName.email || "Researcher");
    } else {
      setCurrentUser({ fullName: userOrName, email: "" });
      setUsername(userOrName || "Researcher");
    }
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
            onGeneratedDoc={(doc) => setHomeGeneratedDoc(doc)}
            username={username}
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
            <div className="doc-viewer-modal-backdrop" onClick={() => setHomeGeneratedDoc(null)}>
              <div className="doc-viewer-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-top-bar">
                  <div className="modal-breadcrumbs">
                    <span>ThesisMate Scientific Output</span> / <span>Document #{homeGeneratedDoc.id}</span>
                  </div>
                  <button className="modal-close-btn" onClick={() => setHomeGeneratedDoc(null)}>
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
                  <div className="modal-footer-left">
                    <button
                      className="btn-primary"
                      onClick={() => handlePrintHomeDoc(homeGeneratedDoc)}
                    >
                      <i className="fa-solid fa-file-pdf"></i> {t.dashDownloadPdf || "Download & Print PDF"}
                    </button>
                    <button
                      className="btn-outline bg-white"
                      onClick={() => {
                        setHomeGeneratedDoc(null);
                        setPage("dashboard");
                      }}
                    >
                      <i className="fa-solid fa-microscope"></i> {t.navOpenWorkspace || "Open in Workspace →"}
                    </button>
                  </div>
                  <button className="btn-outline" onClick={() => setHomeGeneratedDoc(null)}>
                    {t.dashCloseViewer || "Close Viewer"}
                  </button>
                </div>
              </div>
            </div>
          )}
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