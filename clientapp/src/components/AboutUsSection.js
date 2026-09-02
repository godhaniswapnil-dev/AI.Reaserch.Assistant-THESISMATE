import React, { useState } from "react";

export default function AboutUsSection({ onFeatureClick, t }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
    { q: t.faqQ5, a: t.faqA5 },
  ];

  return (
    <section id="about-us" className="about-us-section">
      <div className="about-header-group text-center">
        <span className="subheading">{t.aboutSubheading}</span>
        <h2 className="section-title">
          {t.aboutTitlePrefix} <i>{t.aboutTitleItalic}</i>
        </h2>
        <p className="section-desc" style={{ margin: "0 auto 30px" }}>
          {t.aboutDesc}
        </p>

        {/* Tab Selection Navigation */}
        <div className="about-tabs-pill-row">
          <button
            className={`about-pill-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <i className="fa-solid fa-microchip"></i> {t.aboutTabAi}
          </button>
          <button
            className={`about-pill-btn ${activeTab === "guide" ? "active" : ""}`}
            onClick={() => setActiveTab("guide")}
          >
            <i className="fa-solid fa-map-location-dot"></i> {t.aboutTabGuide}
          </button>
          <button
            className={`about-pill-btn ${activeTab === "features" ? "active" : ""}`}
            onClick={() => setActiveTab("features")}
          >
            <i className="fa-solid fa-award"></i> {t.aboutTabCapabilities}
          </button>
          <button
            className={`about-pill-btn ${activeTab === "faq" ? "active" : ""}`}
            onClick={() => setActiveTab("faq")}
          >
            <i className="fa-solid fa-circle-question"></i> {t.aboutTabFaq}
          </button>
        </div>
      </div>

      {/* --- TAB 1: AI RESEARCH ASSISTANT OVERVIEW --- */}
      {activeTab === "overview" && (
        <div className="about-tab-content fade-in">
          <div className="about-overview-grid">
            <div className="about-feature-box">
              <div className="about-box-icon">
                <i className="fa-solid fa-brain"></i>
              </div>
              <h3>{t.aboutCard1Title}</h3>
              <p>{t.aboutCard1Desc}</p>
            </div>

            <div className="about-feature-box">
              <div className="about-box-icon">
                <i className="fa-solid fa-database"></i>
              </div>
              <h3>{t.aboutCard2Title}</h3>
              <p>{t.aboutCard2Desc}</p>
            </div>

            <div className="about-feature-box">
              <div className="about-box-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3>{t.aboutCard3Title}</h3>
              <p>{t.aboutCard3Desc}</p>
            </div>

            <div className="about-feature-box">
              <div className="about-box-icon">
                <i className="fa-solid fa-file-export"></i>
              </div>
              <h3>{t.aboutCard4Title}</h3>
              <p>{t.aboutCard4Desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: STEP-BY-STEP WEBSITE USER GUIDE --- */}
      {activeTab === "guide" && (
        <div className="about-tab-content fade-in">
          <div className="about-guide-roadmap">
            <div className="roadmap-card">
              <div className="roadmap-step-badge">{t.guideStep1Badge}</div>
              <div className="roadmap-content">
                <h4><i className="fa-solid fa-user-plus"></i> {t.guideStep1Title}</h4>
                <p>{t.guideStep1Desc}</p>
              </div>
            </div>

            <div className="roadmap-card">
              <div className="roadmap-step-badge">{t.guideStep2Badge}</div>
              <div className="roadmap-content">
                <h4><i className="fa-solid fa-pen-nib"></i> {t.guideStep2Title}</h4>
                <p>{t.guideStep2Desc}</p>
              </div>
            </div>

            <div className="roadmap-card">
              <div className="roadmap-step-badge">{t.guideStep3Badge}</div>
              <div className="roadmap-content">
                <h4><i className="fa-solid fa-sliders"></i> {t.guideStep3Title}</h4>
                <p>{t.guideStep3Desc}</p>
              </div>
            </div>

            <div className="roadmap-card">
              <div className="roadmap-step-badge">{t.guideStep4Badge}</div>
              <div className="roadmap-content">
                <h4><i className="fa-solid fa-bolt"></i> {t.guideStep4Title}</h4>
                <p>{t.guideStep4Desc}</p>
              </div>
            </div>

            <div className="roadmap-card">
              <div className="roadmap-step-badge">{t.guideStep5Badge}</div>
              <div className="roadmap-content">
                <h4><i className="fa-solid fa-file-arrow-down"></i> {t.guideStep5Title}</h4>
                <p>{t.guideStep5Desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: CORE CAPABILITIES & FORMATS --- */}
      {activeTab === "features" && (
        <div className="about-tab-content fade-in">
          <div className="about-capabilities-grid">
            <div className="capability-card">
              <div className="cap-header">
                <i className="fa-solid fa-book-bookmark text-green"></i>
                <h4>{t.capTitle1}</h4>
              </div>
              <p>{t.capDesc1}</p>
              <div className="cap-tag-cluster">
                <span className="cap-tag">APA 7th Edition</span>
                <span className="cap-tag">IEEE Transactions</span>
                <span className="cap-tag">MLA 9th Edition</span>
                <span className="cap-tag">Chicago 17th Manual</span>
                <span className="cap-tag">Harvard Style</span>
                <span className="cap-tag">Vancouver Protocol</span>
              </div>
            </div>

            <div className="capability-card">
              <div className="cap-header">
                <i className="fa-solid fa-language text-green"></i>
                <h4>{t.capTitle2}</h4>
              </div>
              <p>{t.capDesc2}</p>
              <div className="cap-tag-cluster">
                <span className="cap-tag">English (US/UK)</span>
                <span className="cap-tag">German (Deutsch)</span>
                <span className="cap-tag">Spanish (Español)</span>
                <span className="cap-tag">French (Français)</span>
                <span className="cap-tag">Hindi (हिंदी)</span>
                <span className="cap-tag">Chinese (中文)</span>
                <span className="cap-tag">Japanese (日本語)</span>
              </div>
            </div>

            <div className="capability-card">
              <div className="cap-header">
                <i className="fa-solid fa-file-export text-green"></i>
                <h4>{t.capTitle3}</h4>
              </div>
              <p>{t.capDesc3}</p>
              <div className="cap-tag-cluster">
                <span className="cap-tag">Printable PDF with DOI Badges</span>
                <span className="cap-tag">Overleaf / LaTeX Package (.tex)</span>
                <span className="cap-tag">Microsoft Word Document (.docx)</span>
                <span className="cap-tag">BibTeX Database File (.bib)</span>
              </div>
            </div>

            <div className="capability-card">
              <div className="cap-header">
                <i className="fa-solid fa-lock text-green"></i>
                <h4>{t.capTitle4}</h4>
              </div>
              <p>{t.capDesc4}</p>
              <div className="cap-tag-cluster">
                <span className="cap-tag">AES-256 Workspace Encryption</span>
                <span className="cap-tag">GDPR &amp; SOC2 Compliant</span>
                <span className="cap-tag">No Model Training on User Prompts</span>
                <span className="cap-tag">100% Researcher IP Retention</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: INTERACTIVE FAQS & KNOWLEDGE BASE --- */}
      {activeTab === "faq" && (
        <div className="about-tab-content fade-in">
          <div className="about-faq-accordion">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`faq-item-card ${isOpen ? "open" : ""}`}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                >
                  <div className="faq-question-row">
                    <span className="faq-q-text">{faq.q}</span>
                    <span className="faq-toggle-icon">
                      <i className={`fa-solid ${isOpen ? "fa-minus" : "fa-plus"}`}></i>
                    </span>
                  </div>
                  {isOpen && (
                    <div className="faq-answer-body">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom CTA Banner */}
      <div className="about-cta-banner">
        <div className="cta-left-text">
          <h3>{t.aboutCtaTitle}</h3>
          <p>{t.aboutCtaDesc}</p>
        </div>
        <button className="btn-primary" onClick={onFeatureClick} style={{ padding: "14px 28px", fontSize: "1rem" }}>
          {t.aboutCtaBtn}
        </button>
      </div>
    </section>
  );
}
