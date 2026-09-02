import React from "react";
import { translations } from "../translations";

export default function TermsOfServicePage({ onNavigate, t, lang = "EN" }) {
  const activeT = t || translations[lang] || translations.EN;
  const isHindi = lang === "HI";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="privacy-page-container">
      {/* Top Navigation & Action Ribbon */}
      <div className="privacy-top-bar">
        <button
          className="btn-outline bg-white back-btn-inline"
          onClick={() => onNavigate("home")}
        >
          <i className="fa-solid fa-arrow-left"></i> {activeT.dashBackHome || "Back to Home"}
        </button>

        <div className="privacy-actions-right">
          <button
            className="btn-outline bg-white"
            onClick={handlePrint}
            title="Print or Save Terms as PDF"
          >
            <i className="fa-solid fa-print"></i> {isHindi ? "प्रिंट करें (Print)" : "Print Terms"}
          </button>
          <button
            className="btn-primary doc-external-btn"
            onClick={() => onNavigate("privacy")}
          >
            <i className="fa-solid fa-shield-halved"></i> {isHindi ? "गोपनीयता नीति देखें →" : "View Privacy Policy →"}
          </button>
        </div>
      </div>

      {/* Main Document Container */}
      <div className="privacy-content-card">
        {/* Header Block */}
        <div className="privacy-header">
          <div className="privacy-badge">
            <i className="fa-solid fa-file-contract text-green"></i> LEGAL TERMS &bull; ACADEMIC INTEGRITY
          </div>
          <h1 className="privacy-title">
            {isHindi ? "सेवा की शर्तें (Terms of Service)" : "Terms of Service & Research Guidelines"}
          </h1>
          <div className="privacy-meta-row">
            <span><strong>Effective Date:</strong> August 19, 2026</span>
            <span>&bull;</span>
            <span><strong>Jurisdiction:</strong> Gujarat, India</span>
            <span>&bull;</span>
            <span><strong>Platform:</strong> ThesisMate AI Research Assistant</span>
          </div>
          <p className="privacy-lead-paragraph">
            {isHindi
              ? "ये सेवा की शर्तें (Terms of Service) ThesisMate प्लेटफॉर्म के उपयोग और नैतिक अनुसंधान मानकों को नियंत्रित करती हैं। इस सेवा का उपयोग करके, आप इन शर्तों और अनुसंधान अखंडता नियमों का पालन करने के लिए सहमत होते हैं।"
              : "These Terms of Service govern your access to and utilization of ThesisMate. By creating an account or using our scientific synthesis tools, you agree to comply with international academic integrity guidelines, citation standards, and these legal conditions."}
          </p>
        </div>

        {/* Quick Summary Box */}
        <div className="privacy-summary-box">
          <h3>
            <i className="fa-solid fa-circle-check text-green"></i>{" "}
            {isHindi ? "मुख्य नियम एवं अधिकार (Key Principles)" : "Terms at a Glance"}
          </h3>
          <div className="summary-grid">
            <div className="summary-card">
              <i className="fa-solid fa-copyright text-green"></i>
              <strong>{isHindi ? "100% आपका बौद्धिक अधिकार" : "100% IP Ownership"}</strong>
              <p>{isHindi ? "आपके द्वारा तैयार शोध पत्र पर आपका पूर्ण कॉपीराइट रहता है।" : "You retain full copyright and ownership of all generated research drafts."}</p>
            </div>
            <div className="summary-card">
              <i className="fa-solid fa-award text-green"></i>
              <strong>{isHindi ? "0% साहित्यिक चोरी" : "0% Plagiarism Policy"}</strong>
              <p>{isHindi ? "सभी संदर्भ वास्तविक DOI और पीयर-रिव्यू रिपॉजिटरी से प्राप्त होते हैं।" : "All citations are strictly grounded in indexed repositories with real DOIs."}</p>
            </div>
            <div className="summary-card">
              <i className="fa-solid fa-user-gear text-green"></i>
              <strong>{isHindi ? "नैतिक अनुसंधान दायित्व" : "Ethical Researcher Duty"}</strong>
              <p>{isHindi ? "अंतिम सबमिशन से पहले ड्राफ्ट की अकादमिक समीक्षा शोधकर्ता का दायित्व है।" : "Researchers must review generated drafts prior to formal journal submissions."}</p>
            </div>
            <div className="summary-card">
              <i className="fa-solid fa-envelope text-green"></i>
              <strong>{isHindi ? "कानूनी सहायता" : "Legal & Compliance Contact"}</strong>
              <p>godhaniswapnil53@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Section 1: Acceptance of Terms */}
        <section className="privacy-section">
          <h2>1. Acceptance of Terms &amp; Scope of Service</h2>
          <p>
            By accessing ThesisMate ("the Application", "We", "Us"), you confirm that you are at least 16 years of age and authorized to bind yourself or your academic institution to these Terms. ThesisMate provides algorithmic synthesis, literature aggregation via Semantic Scholar, PubMed, arXiv, and Crossref, automated citation formatting, and multi-page research drafting tools.
          </p>
        </section>

        {/* Section 2: Intellectual Property & Ownership */}
        <section className="privacy-section">
          <h2>2. Intellectual Property &amp; Researcher Ownership</h2>
          <p>
            <strong>Your Intellectual Property:</strong> We assert no ownership over your prompts, uploaded reference libraries, customized outlines, or resulting output documents. You retain full intellectual property and moral rights to all scientific dissertations, survey papers, and thesis materials generated through your account.
          </p>
          <p>
            <strong>Platform Rights:</strong> The ThesisMate software architecture, deterministic RAG algorithms, UI designs, and documentation remain the exclusive intellectual property of the ThesisMate development team.
          </p>
        </section>

        {/* Section 3: Academic Integrity & Ethical Guidelines */}
        <section className="privacy-section">
          <h2>3. Academic Integrity &amp; Ethical Research Standards</h2>
          <p>
            ThesisMate is engineered to empower scholars and eliminate citation hallucinations. However, users agree to uphold ethical standards:
          </p>
          <ul className="privacy-list">
            <li><strong>Peer Review Requirement:</strong> The researcher assumes full responsibility for fact-checking final dissertation submissions in accordance with their university or journal guidelines.</li>
            <li><strong>Prohibited Misuse:</strong> You may not use ThesisMate to generate deceptive academic submissions, bypass plagiarism detection tools, or propagate falsified empirical data.</li>
            <li><strong>Attribution Compliance:</strong> All generated bibliographies adhere to standard citation guidelines (APA 7th, IEEE, MLA 9th, Harvard, Chicago, Vancouver). Users agree to preserve factual source provenance.</li>
          </ul>
        </section>

        {/* Section 4: Data Privacy & Security */}
        <section className="privacy-section">
          <h2>4. Data Privacy, Storage &amp; Encryption</h2>
          <p>
            Your research drafts, thesis prompts, and profile information are encrypted using AES-256 protocols. In strict adherence to our <span onClick={() => onNavigate("privacy")} style={{ color: "var(--text-main)", fontWeight: "600", textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>, we never sell, monetize, or transfer researcher data to third-party advertising networks.
          </p>
        </section>

        {/* Section 5: Service Availability & Subscriptions */}
        <section className="privacy-section">
          <h2>5. Service Availability &amp; Rate Limits</h2>
          <p>
            ThesisMate strives for 99.9% platform availability. To maintain computational stability during high-throughput 80-page generation cycles, fair-use rate limits may apply to simultaneous document generation requests.
          </p>
        </section>

        {/* Section 6: Limitation of Liability */}
        <section className="privacy-section">
          <h2>6. Limitation of Liability &amp; Disclaimers</h2>
          <p>
            The service is provided on an "as-is" and "as-available" basis. While our deterministic verification pipeline eliminates hallucinated citations with industry-leading precision, ThesisMate shall not be liable for academic grading outcomes, journal rejection decisions, or third-party repository downtime.
          </p>
        </section>

        {/* Section 7: Jurisdiction & Governing Law */}
        <section className="privacy-section">
          <h2>7. Governing Law &amp; Dispute Resolution</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of <strong>Gujarat, India</strong>, without regard to its conflict of law provisions. Any legal disputes arising from the service shall be subject to the exclusive jurisdiction of the competent courts in Gujarat, India.
          </p>
        </section>

        {/* Section 8: Contact Us */}
        <section className="privacy-section">
          <h2>8. Contact &amp; Legal Inquiries</h2>
          <p>If you have any questions or feedback regarding these Terms of Service, please reach out to:</p>
          <div className="contact-info-card">
            <div className="contact-item">
              <i className="fa-solid fa-envelope text-green"></i>
              <div>
                <strong>Legal &amp; Compliance Email:</strong>
                <p><a href="mailto:godhaniswapnil53@gmail.com">godhaniswapnil53@gmail.com</a></p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fa-solid fa-location-dot text-green"></i>
              <div>
                <strong>Jurisdiction:</strong>
                <p>Gujarat, India</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="privacy-footer-action">
          <button
            className="btn-primary"
            onClick={() => onNavigate("home")}
          >
            <i className="fa-solid fa-house"></i> {isHindi ? "होम पेज पर वापस जाएं" : "Return to ThesisMate Home"}
          </button>
        </div>
      </div>
    </div>
  );
}
