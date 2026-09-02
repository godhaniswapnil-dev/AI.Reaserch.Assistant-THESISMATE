import React, { useState, useEffect, useRef } from "react";

export default function Navbar({
  onNavigate,
  isAuthenticated,
  onLogout,
  currentUser,
  username,
  lang,
  onSelectLang,
  t,
  onOpenProfile,
  onOpenSettings
}) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const langMenuRef = useRef(null);

  const languages = [
    { code: "EN", name: "English" },
    { code: "HI", name: "Hindi (हिंदी)" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectLanguage = (code) => {
    onSelectLang(code);
    setIsLangOpen(false);
  };

  const handleNavLinkClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    onNavigate("home");
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const displayName = currentUser?.fullName || username || (t.navResearcher || "Researcher");
  const displayEmail = currentUser?.email || "";
  const initialLetter = displayName ? displayName.charAt(0).toUpperCase() : "U";

  return (
    <nav className="site-navbar">
      {/* Brand Logo */}
      <div className="logo" onClick={() => handleNavLinkClick("home")} style={{ cursor: "pointer" }}>
        <div className="logo-icon">1</div> ThesisMate
      </div>

      {/* Desktop Navigation Links */}
      <div className="nav-links desktop-only">
        <a href="#home" onClick={(e) => { e.preventDefault(); handleNavLinkClick("home"); }}>
          {t.navHome}
        </a>
        <a href="#about-us" onClick={(e) => { e.preventDefault(); handleNavLinkClick("about-us"); }}>
          {t.navAbout}
        </a>
        <a href="#integrations" onClick={(e) => { e.preventDefault(); handleNavLinkClick("integrations"); }}>
          {t.navIntegrations}
        </a>
        <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavLinkClick("contact"); }}>
          {t.navContact}
        </a>
      </div>

      {/* Desktop Actions */}
      <div className="nav-actions desktop-only">
        {isAuthenticated ? (
          <div className="nav-user-cluster" ref={userMenuRef}>
            <div
              className={`nav-user-avatar ${isUserMenuOpen ? "active" : ""}`}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              title="Click to view Profile, Settings, Privacy & Terms"
              style={{ cursor: "pointer" }}
            >
              {initialLetter}
            </div>
            <span
              className="nav-user-name"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              style={{ cursor: "pointer" }}
            >
              {displayName}
            </span>
            <i
              className={`fa-solid fa-chevron-${isUserMenuOpen ? "up" : "down"} nav-user-chevron`}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              style={{ fontSize: "0.72rem", color: "var(--text-muted)", cursor: "pointer", transition: "transform 0.2s ease" }}
            ></i>

            {/* Professional User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="user-dropdown-card">
                <div className="user-dropdown-header">
                  <div className="dropdown-user-avatar">
                    {initialLetter}
                  </div>
                  <div className="dropdown-user-meta">
                    <strong className="dropdown-user-fullname">{displayName}</strong>
                    <span className="dropdown-user-role">
                      <span className="status-dot">●</span> {displayEmail || (t.navResearcher || "Research Scholar")}
                    </span>
                  </div>
                </div>

                <div className="user-dropdown-divider"></div>

                <div className="user-dropdown-items">
                  <button
                    className="user-dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (onOpenProfile) onOpenProfile();
                    }}
                  >
                    <i className="fa-solid fa-user-tie"></i>
                    <div className="dropdown-item-text">
                      <span>{t.navProfile || "Profile Details"}</span>
                      <small>{lang === "HI" ? "शोधकर्ता प्रोफ़ाइल और विवरण" : "Researcher Bio & Affiliation"}</small>
                    </div>
                  </button>

                  <button
                    className="user-dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (onOpenSettings) onOpenSettings();
                    }}
                  >
                    <i className="fa-solid fa-sliders"></i>
                    <div className="dropdown-item-text">
                      <span>{t.navSettings || "Settings"}</span>
                      <small>{lang === "HI" ? "उद्धरण प्रारूप और सेटिंग्स" : "Preferences & Citation Config"}</small>
                    </div>
                  </button>

                  <button
                    className="user-dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate("privacy");
                    }}
                  >
                    <i className="fa-solid fa-shield-halved"></i>
                    <div className="dropdown-item-text">
                      <span>{t.navPrivacy || "Privacy Policy"}</span>
                      <small>{lang === "HI" ? "डेटा सुरक्षा और कानूनी नीतियां" : "Data Protection & Security"}</small>
                    </div>
                  </button>

                  <button
                    className="user-dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate("terms");
                    }}
                  >
                    <i className="fa-solid fa-file-contract"></i>
                    <div className="dropdown-item-text">
                      <span>{t.navTerms || "Terms of Service"}</span>
                      <small>{lang === "HI" ? "અકાદમિક अखंडता दिशानिर्देश" : "Academic Integrity & Rules"}</small>
                    </div>
                  </button>

                  <button
                    className="user-dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate("dashboard");
                    }}
                  >
                    <i className="fa-solid fa-microscope"></i>
                    <div className="dropdown-item-text">
                      <span>{t.navWorkspace || "Research Workspace"}</span>
                      <small>{lang === "HI" ? "80-पेज थीसिस जनरेटर लैब" : "80-Page Synthesis Studio"}</small>
                    </div>
                  </button>
                </div>

                <div className="user-dropdown-divider"></div>

                <button
                  className="user-dropdown-logout-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout();
                  }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i> {t.navLogout || "Logout"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={() => onNavigate("login")}
              className="nav-login-link"
            >
              {t.navLogin}
            </button>
            <button
              className="btn-primary nav-signup-btn"
              onClick={() => onNavigate("signup")}
            >
              {t.navSignUp} <i className="fa-solid fa-arrow-right" style={{ fontSize: "0.75em" }}></i>
            </button>
          </>
        )}

        {/* Website Language Dropdown */}
        <div className="lang-picker-wrapper" ref={langMenuRef}>
          <button
            className="btn-outline bg-white lang-btn"
            onClick={() => setIsLangOpen(!isLangOpen)}
          >
            {lang === "HI" ? "HI (हिंदी)" : "EN"}{" "}
            <i className={`fa-solid fa-chevron-${isLangOpen ? "up" : "down"}`} style={{ fontSize: "0.7em" }}></i>
          </button>

          {isLangOpen && (
            <div className="lang-dropdown-menu">
              {languages.map((l) => (
                <div
                  key={l.code}
                  onClick={() => handleSelectLanguage(l.code)}
                  className={`lang-option ${lang === l.code ? "active" : ""}`}
                >
                  <span>{l.name}</span>
                  <span className="lang-code-tag">{l.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Hamburger Toggle Button */}
      <button
        className="mobile-nav-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        <i className={`fa-solid ${isMobileMenuOpen ? "fa-xmark" : "fa-bars"}`}></i>
      </button>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-drawer-links">
            <a href="#home" onClick={(e) => { e.preventDefault(); handleNavLinkClick("home"); }}>
              <i className="fa-solid fa-house"></i> {t.navHome}
            </a>
            <a href="#about-us" onClick={(e) => { e.preventDefault(); handleNavLinkClick("about-us"); }}>
              <i className="fa-solid fa-circle-info"></i> {t.navAbout}
            </a>
            <a href="#integrations" onClick={(e) => { e.preventDefault(); handleNavLinkClick("integrations"); }}>
              <i className="fa-solid fa-plug"></i> {t.navIntegrations}
            </a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavLinkClick("contact"); }}>
              <i className="fa-solid fa-envelope"></i> {t.navContact}
            </a>
          </div>

          <div className="mobile-drawer-footer">
            {isAuthenticated ? (
              <div className="mobile-user-row">
                <div
                  className="mobile-user-info"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenProfile) onOpenProfile();
                  }}
                >
                  <div className="nav-user-avatar">
                    {initialLetter}
                  </div>
                  <div>
                    <span className="nav-user-name">{displayName}</span>
                    <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                      <span className="status-dot">●</span> {displayEmail || (t.navResearcher || "Research Scholar")}
                    </div>
                  </div>
                </div>

                <div className="mobile-user-menu-list" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button
                    className="btn-outline bg-white"
                    style={{ width: "100%", justifyContent: "flex-start", gap: "10px", fontSize: "0.9rem" }}
                    onClick={() => { setIsMobileMenuOpen(false); if (onOpenProfile) onOpenProfile(); }}
                  >
                    <i className="fa-solid fa-user-tie"></i> {t.navProfile || "Profile Details"}
                  </button>
                  <button
                    className="btn-outline bg-white"
                    style={{ width: "100%", justifyContent: "flex-start", gap: "10px", fontSize: "0.9rem" }}
                    onClick={() => { setIsMobileMenuOpen(false); if (onOpenSettings) onOpenSettings(); }}
                  >
                    <i className="fa-solid fa-sliders"></i> {t.navSettings || "Settings"}
                  </button>
                  <button
                    className="btn-outline bg-white"
                    style={{ width: "100%", justifyContent: "flex-start", gap: "10px", fontSize: "0.9rem" }}
                    onClick={() => { setIsMobileMenuOpen(false); onNavigate("privacy"); }}
                  >
                    <i className="fa-solid fa-shield-halved"></i> {t.navPrivacy || "Privacy Policy"}
                  </button>
                  <button
                    className="btn-outline bg-white"
                    style={{ width: "100%", justifyContent: "flex-start", gap: "10px", fontSize: "0.9rem" }}
                    onClick={() => { setIsMobileMenuOpen(false); onNavigate("terms"); }}
                  >
                    <i className="fa-solid fa-file-contract"></i> {t.navTerms || "Terms of Service"}
                  </button>
                  <button
                    className="btn-primary"
                    style={{ width: "100%", justifyContent: "center", gap: "8px" }}
                    onClick={() => { setIsMobileMenuOpen(false); onNavigate("dashboard"); }}
                  >
                    <i className="fa-solid fa-microscope"></i> {t.navOpenWorkspace || "Open Workspace →"}
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onLogout(); }}
                    className="btn-outline"
                    style={{ width: "100%", justifyContent: "center", color: "var(--support-red)" }}
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> {t.navLogout || "Logout"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-auth-btns">
                <button
                  className="btn-outline bg-white"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => { setIsMobileMenuOpen(false); onNavigate("login"); }}
                >
                  {t.navLogin}
                </button>
                <button
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => { setIsMobileMenuOpen(false); onNavigate("signup"); }}
                >
                  {t.navSignUp} →
                </button>
              </div>
            )}

            {/* Mobile Language Switcher */}
            <div className="mobile-lang-row">
              <span>{lang === "HI" ? "भाषा (Language):" : "Language:"}</span>
              <div className="mobile-lang-chips">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    className={`lang-chip ${lang === l.code ? "active" : ""}`}
                    onClick={() => handleSelectLanguage(l.code)}
                  >
                    {l.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
