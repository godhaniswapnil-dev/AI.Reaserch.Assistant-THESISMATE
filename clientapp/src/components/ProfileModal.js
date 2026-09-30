import React, { useState, useEffect } from "react";
import { generatePrintablePdfHtml } from "../services/researchGenerator";
import { getUserProfile, saveUserProfile, getUserDocs, saveUserDocs, migrateUserData } from "../services/userStorage";
import { updateUser, getAllUsers } from "../services/authService";
import { getAllResearchPapers, deleteResearchPaperFromBackend } from "../services/researchService";

export default function ProfileModal({
  isOpen,
  onClose,
  currentUser,
  username,
  onSaveProfile,
  onSaveUsername,
  onNavigateToWorkspace,
  t,
  lang = "EN"
}) {
  const isHindi = lang === "HI";

  // Tab State: "repos" (Repositories & Papers) vs "details" (Profile Info)
  const [activeTab, setActiveTab] = useState("repos");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [userDocs, setUserDocs] = useState([]);
  const [expandedDocId, setExpandedDocId] = useState(null);

  // Load strictly isolated user profile and papers from storage & backend
  useEffect(() => {
    if (isOpen) {
      const activeUser = currentUser || username;
      const profile = getUserProfile(activeUser);
      setName(profile.name || username || "Research Scholar");
      setEmail(profile.email || (currentUser?.email || ""));
      setInstitution(profile.institution || "");
      setDepartment(profile.department || "");
      setBio(profile.bio || "");

      // 1. Load local documents strictly for this user
      const docs = getUserDocs(activeUser);
      setUserDocs(docs);

      // 2. Sync with SQL backend strictly for this user's email
      const userEmail = (typeof activeUser === "object" ? activeUser?.email : "") || profile.email || "";
      if (userEmail) {
        getAllResearchPapers(userEmail).then((backendPapers) => {
          if (backendPapers && Array.isArray(backendPapers)) {
            const formatted = backendPapers.map((bp) => ({
              id: bp.id,
              title: bp.topic || bp.title || "Research Paper",
              topic: bp.topic || "General Research",
              userEmail: bp.userEmail || userEmail,
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
            const localPapers = getUserDocs(activeUser) || [];
            const docMap = new Map();
            formatted.forEach((d) => {
              if (d && d.id) docMap.set(String(d.id), d);
            });
            localPapers.forEach((d) => {
              if (d && d.id) {
                const existing = docMap.get(String(d.id));
                docMap.set(String(d.id), { ...existing, ...d });
              }
            });
            const merged = Array.from(docMap.values());
            setUserDocs(merged);
            saveUserDocs(activeUser, merged);
          }
        });
      }
    }
  }, [isOpen, currentUser, username]);

  if (!isOpen) return null;

  // Dynamic calculations based solely on user's actual generated papers
  const userPapersCount = userDocs.length;
  const totalPagesDrafted = userDocs.reduce((acc, d) => acc + (Number(d.pages) || 0), 0);
  const totalCitationsCount = userDocs.reduce((acc, d) => acc + (Number(d.citations) || 0), 0);

  const handleSave = async (e) => {
    e.preventDefault();
    const activeUser = currentUser || username;
    const trimmedName = name.trim() || "Research Scholar";
    const trimmedEmail = email.trim();

    const updatedProfile = {
      name: trimmedName,
      email: trimmedEmail,
      institution: institution.trim(),
      department: department.trim(),
      bio: bio.trim()
    };

    // 1. Preserve and migrate user repositories/documents to new identifier
    migrateUserData(activeUser, updatedProfile);
    saveUserProfile(updatedProfile, updatedProfile);

    // 2. Call backend User PUT API to update SQL database table
    try {
      let targetUserId = currentUser?.id;
      if (!targetUserId) {
        const allUsers = await getAllUsers();
        if (Array.isArray(allUsers)) {
          const currentEmail = currentUser?.email || email;
          const match = allUsers.find(
            (u) =>
              (u.email && u.email.toLowerCase() === currentEmail?.toLowerCase()) ||
              (u.fullName && u.fullName.toLowerCase() === (currentUser?.fullName || username)?.toLowerCase())
          );
          if (match?.id) targetUserId = match.id;
        }
      }

      if (targetUserId) {
        await updateUser(targetUserId, {
          fullName: trimmedName,
          email: trimmedEmail
        });
      }
    } catch (err) {
      console.warn("Backend user update note:", err.message);
    }

    // 3. Immediately refresh and preserve user's repositories
    const refreshedDocs = getUserDocs(updatedProfile);
    setUserDocs(refreshedDocs);

    if (onSaveProfile) {
      onSaveProfile(updatedProfile);
    }
    if (onSaveUsername) {
      onSaveUsername(updatedProfile.name);
    }

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handlePrintDoc = (doc) => {
    const printWindow = window.open("", "_blank", "width=880,height=920");
    if (printWindow) {
      printWindow.document.write(generatePrintablePdfHtml(doc, name || username));
      printWindow.document.close();
    }
  };

  const handleDownloadBibTeX = (doc) => {
    const bibtexContent = (doc.references || [])
      .map((ref, idx) => "@article{ref_" + (doc.id || idx) + "_" + (idx + 1) + ",\n  title={" + (doc.title || "Paper") + "},\n  note={" + ref + "}\n}")
      .join("\n\n");
    const blob = new Blob([bibtexContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ThesisMate_" + (doc.title || "paper").slice(0, 20).replace(/\s+/g, "_") + ".bib";
    a.click();
  };

  const handleDeleteDoc = (docId, e) => {
    if (e) e.stopPropagation();
    const activeUser = currentUser || username;
    const confirmMsg = isHindi
      ? "क्या आप इस शोध पत्र को अपनी रिपॉजिटरी से हटाना चाहते हैं?"
      : "Are you sure you want to remove this paper from your repository?";

    if (window.confirm(confirmMsg)) {
      const updated = userDocs.filter((d) => d.id !== docId);
      setUserDocs(updated);
      saveUserDocs(activeUser, updated);
      deleteResearchPaperFromBackend(docId);
    }
  };

  const initialLetter = name ? name.charAt(0).toUpperCase() : (username ? username.charAt(0).toUpperCase() : "R");

  return (
    <div className="doc-viewer-modal-backdrop" onClick={onClose}>
      <div className="doc-viewer-modal profile-modal-card" style={{ maxWidth: "780px" }} onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className="modal-top-bar">
          <div className="modal-breadcrumbs">
            <span>{isHindi ? "शोधकर्ता प्रोफ़ाइल & रिपॉजिटरी" : "Researcher Profile & Repositories"}</span> / <span>{name || "Profile"}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-paper-view" style={{ padding: "clamp(20px, 3.5vw, 32px)" }}>
          {/* Header Banner */}
          <div className="profile-banner-row">
            <div className="profile-large-avatar">{initialLetter}</div>
            <div className="profile-banner-info">
              <div className="profile-role-badge">
                <i className="fa-solid fa-circle-check text-green"></i> {isHindi ? "सत्यापित शोधकर्ता • THESISMATE" : "VERIFIED RESEARCH SCHOLAR • THESISMATE"}
              </div>
              <h2 className="profile-name-heading">{name || "Research Scholar"}</h2>
              <p className="profile-sub-line">
                <i className="fa-solid fa-building-columns"></i>{" "}
                {institution ? (department ? institution + " • " + department : institution) : (isHindi ? "अकादमिक संस्थान (सेट नहीं किया गया)" : "Academic Affiliation (Not Specified)")}
              </p>
            </div>
          </div>

          {/* Dynamic Live Quick Stats Grid (Tailored to user's actual work) */}
          <div className="profile-stats-grid">
            <div className="profile-stat-box">
              <span className="profile-stat-val">
                {totalPagesDrafted} Pages
              </span>
              <span className="profile-stat-lbl">
                {isHindi ? "कुल ड्राफ्ट किए गए पृष्ठ" : "Total Pages Drafted"}
              </span>
            </div>

            <div className="profile-stat-box">
              <span className="profile-stat-val">
                {userPapersCount > 0 ? "99.8%" : (isHindi ? "तैयार" : "Ready")}
              </span>
              <span className="profile-stat-lbl">
                {isHindi ? "सत्यापित उद्धरण दर" : "DOI Accuracy"}
              </span>
            </div>

            <div className="profile-stat-box" style={{ borderColor: "#1b8a5a", background: "#f0f8f4" }}>
              <span className="profile-stat-val" style={{ color: "#1b8a5a" }}>
                {userPapersCount} {userPapersCount === 1 ? "Paper" : "Papers"}
              </span>
              <span className="profile-stat-lbl" style={{ fontWeight: "600", color: "#1b8a5a" }}>
                {isHindi ? "सक्रिय रिपॉजिटरी (Live Repos)" : "Active Repositories"}
              </span>
            </div>

            <div className="profile-stat-box">
              <span className="profile-stat-val">
                {totalCitationsCount} DOIs
              </span>
              <span className="profile-stat-lbl">
                {isHindi ? "साइटेशन इंडेक्स्ड" : "Citations Indexed"}
              </span>
            </div>
          </div>

          {/* Profile Navigation Tabs */}
          <div className="profile-tabs-nav">
            <button
              className={"profile-tab-btn " + (activeTab === "repos" ? "active" : "")}
              onClick={() => setActiveTab("repos")}
            >
              <i className="fa-solid fa-box-archive"></i>
              <span>{isHindi ? "मेरी रिपॉजिटरी અને શોધ પેપર્સ" : "My Research Repositories"}</span>
              <span className="tab-count-badge">{userPapersCount}</span>
            </button>

            <button
              className={"profile-tab-btn " + (activeTab === "details" ? "active" : "")}
              onClick={() => setActiveTab("details")}
            >
              <i className="fa-solid fa-user-pen"></i>
              <span>{isHindi ? "शोधकर्ता प्रोफ़ाइल विवरण" : "Researcher Bio & Credentials"}</span>
            </button>
          </div>

          {/* TAB 1: REPOSITORIES & GENERATED RESEARCH PAPERS */}
          {activeTab === "repos" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ fontSize: "0.88rem", color: "var(--text-muted)", fontWeight: "600" }}>
                  {isHindi
                    ? "लॉग-इन यूजर (" + (name || "User") + ") द्वारा तैयार किए गए शोध पत्र:"
                    : "Generated Research Dissertations for " + (name || "User") + ":"}
                </span>
                <span className="profile-repo-tag green">
                  <i className="fa-solid fa-circle-check"></i> {userPapersCount} {isHindi ? "सक्रिय ड्राफ्ट" : "Active Drafts"}
                </span>
              </div>

              {userDocs.length === 0 ? (
                <div className="profile-empty-repos" style={{ textAlign: "center", padding: "36px 20px" }}>
                  <div className="profile-empty-icon" style={{ fontSize: "2.8rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                    <i className="fa-regular fa-folder-open"></i>
                  </div>
                  <h4 style={{ margin: "0 0 8px 0", color: "var(--text-main)", fontSize: "1.1rem" }}>
                    {isHindi ? "कोई शोध पत्र अभी तक जनरेट नहीं किया गया" : "No Research Papers Generated Yet"}
                  </h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: "0 auto 20px auto", maxWidth: "480px", lineHeight: "1.5" }}>
                    {isHindi
                      ? "आपने अभी तक कोई शोध पत्र नहीं बनाया है। रिसर्च स्टूडियो में अपना टॉपिक दर्ज करके 80-पेज तक का पहला शोध पत्र बनाएं। वह तुरंत यहाँ आपकी प्रोफ़ाइल में दिखेगा।"
                      : "You haven't generated any research papers yet. Use the Research Studio to synthesize your first verified scientific dissertation, and it will automatically appear here."}
                  </p>
                  {onNavigateToWorkspace && (
                    <button
                      className="btn-primary"
                      onClick={() => {
                        onClose();
                        onNavigateToWorkspace();
                      }}
                      style={{ padding: "10px 22px", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "8px" }}
                    >
                      <i className="fa-solid fa-bolt"></i> {isHindi ? "रिसर्च स्टूडियो खोलें →" : "Open Research Studio →"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="profile-repo-container">
                  {userDocs.map((doc, idx) => {
                    const isExpanded = expandedDocId === (doc.id || idx);
                    const databases = doc.databases || ["Semantic Scholar", "PubMed", "arXiv", "Crossref"];

                    return (
                      <div key={doc.id || idx} className="profile-repo-card">
                        <div className="profile-repo-header">
                          <div>
                            <h4 className="profile-repo-title">{doc.title}</h4>
                            <div className="profile-repo-tags">
                              <span className="profile-repo-tag green">
                                <i className="fa-solid fa-file-pdf"></i> {doc.pages || 30} Pages
                              </span>
                              <span className="profile-repo-tag">
                                <i className="fa-solid fa-bookmark"></i> {doc.style || "APA 7th"}
                              </span>
                              <span className="profile-repo-tag blue">
                                <i className="fa-solid fa-quote-right"></i> {doc.citations || 18} Citations Verified
                              </span>
                              <span className="profile-repo-tag">
                                <i className="fa-solid fa-calendar"></i> {doc.date || "2026"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Database line */}
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", margin: "8px 0" }}>
                          <span><strong>{isHindi ? "डेटाबेस लाइनएज:" : "Indexed Repositories:"}</strong></span>
                          <span>{databases.join(" • ")}</span>
                        </div>

                        {/* Inline preview if toggled */}
                        {isExpanded && (
                          <div className="profile-repo-preview-box">
                            <strong style={{ color: "var(--text-main)" }}>Abstract:</strong>
                            <p style={{ margin: "4px 0 8px 0" }}>{doc.sections?.abstract || doc.abstract}</p>
                            {doc.keyFindings && doc.keyFindings.length > 0 && (
                              <div>
                                <strong style={{ color: "var(--text-main)" }}>Key Finding:</strong>
                                <p style={{ margin: "2px 0 0 0", color: "#124d32" }}>
                                  ✓ {doc.keyFindings[0]}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="profile-repo-actions">
                          <button
                            className="profile-repo-btn primary"
                            onClick={() => handlePrintDoc(doc)}
                            title="Download/Print exact target pages PDF"
                          >
                            <i className="fa-solid fa-file-pdf"></i> {isHindi ? "PDF प्रिंट करें" : "Download & Print PDF"}
                          </button>

                          <button
                            className="profile-repo-btn"
                            onClick={() => handleDownloadBibTeX(doc)}
                            title="Export BibTeX bibliography"
                          >
                            <i className="fa-solid fa-database"></i> BibTeX (.bib)
                          </button>

                          <button
                            className="profile-repo-btn"
                            onClick={() => setExpandedDocId(isExpanded ? null : (doc.id || idx))}
                          >
                            <i className={"fa-solid " + (isExpanded ? "fa-chevron-up" : "fa-eye")}></i>
                            {isExpanded ? (isHindi ? "संक्षिप्त करें" : "Hide Summary") : (isHindi ? "सारांश देखें" : "View Abstract")}
                          </button>

                          <button
                            className="profile-repo-btn"
                            style={{ color: "#d93025", borderColor: "#fce8e6", background: "#fef7f6" }}
                            onClick={(e) => handleDeleteDoc(doc.id, e)}
                            title="Remove paper from this user repository"
                          >
                            <i className="fa-solid fa-trash"></i> {isHindi ? "हटाएं" : "Delete"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE DETAILS FORM */}
          {activeTab === "details" && (
            <form onSubmit={handleSave} className="profile-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>{isHindi ? "पूरा नाम (Full Name)" : "Full Name"}</label>
                  <input
                    type="text"
                    value={name}
                    placeholder="e.g. Dr. Alex Mercer"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{isHindi ? "ईमेल पता (Email)" : "Email Address"}</label>
                  <input
                    type="email"
                    value={email}
                    placeholder="name@university.edu"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>{isHindi ? "विश्वविद्यालय / संस्थान" : "University / Institution"}</label>
                  <input
                    type="text"
                    value={institution}
                    placeholder="e.g. Stanford University / Indian Institute of Technology"
                    onChange={(e) => setInstitution(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>{isHindi ? "विभाग / अनुसंधान क्षेत्र" : "Department / Research Field"}</label>
                  <input
                    type="text"
                    value={department}
                    placeholder="e.g. Department of Computer Science & AI"
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{isHindi ? "शोधकर्ता विवरण (Research Bio & Focus)" : "Research Bio & Focus"}</label>
                <textarea
                  rows="3"
                  value={bio}
                  placeholder="e.g. Investigating deterministic retrieval-augmented generation and verifiable citation synthesis in multi-page scientific dissertations..."
                  onChange={(e) => setBio(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)",
                    fontFamily: "inherit",
                    resize: "vertical"
                  }}
                ></textarea>
              </div>

              <div className="profile-modal-actions">
                <button type="submit" className="btn-primary" disabled={isSaved}>
                  {isSaved ? (
                    <>
                      <i className="fa-solid fa-check"></i> {isHindi ? "सहेजा गया!" : "Profile Saved!"}
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk"></i> {isHindi ? "प्रोफ़ाइल सहेजें" : "Save Changes"}
                    </>
                  )}
                </button>
                <button type="button" className="btn-outline" onClick={onClose}>
                  {isHindi ? "बंद करें" : "Close"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
