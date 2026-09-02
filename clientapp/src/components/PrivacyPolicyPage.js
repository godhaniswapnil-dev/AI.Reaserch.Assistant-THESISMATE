import React from "react";
import { translations } from "../translations";

export default function PrivacyPolicyPage({ onNavigate, t, lang = "EN" }) {
  const activeT = t || translations[lang] || translations.EN;
  const googleDocUrl = "https://docs.google.com/document/d/1lX7_RhhhMnRPXbV6cR4sSR2NOo-4CiGBVIjJWnhq5qQ/edit?usp=sharing";

  const handlePrint = () => {
    window.print();
  };

  const isHindi = lang === "HI";

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
            title="Print or Save as PDF"
          >
            <i className="fa-solid fa-print"></i> {isHindi ? "प्रिंट करें (Print)" : "Print Policy"}
          </button>
          <a
            href={googleDocUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary doc-external-btn"
          >
            <i className="fa-solid fa-file-lines"></i> {isHindi ? "Google Docs માં જુઓ ↗" : "Open Google Doc ↗"}
          </a>
        </div>
      </div>

      {/* Main Document Container */}
      <div className="privacy-content-card">
        {/* Header Block */}
        <div className="privacy-header">
          <div className="privacy-badge">
            <i className="fa-solid fa-shield-halved text-green"></i> LEGAL &amp; COMPLIANCE &bull; THESISMATE
          </div>
          <h1 className="privacy-title">
            {isHindi ? "एआई रिसर्च असिस्टेंट गोपनीयता नीति (Privacy Policy)" : "Privacy Policy for AI Research Assistant"}
          </h1>
          <div className="privacy-meta-row">
            <span><strong>Last updated:</strong> August 18, 2026</span>
            <span>&bull;</span>
            <span><strong>Jurisdiction:</strong> Gujarat, India</span>
            <span>&bull;</span>
            <span><strong>Application:</strong> AI Research Assistant (ThesisMate)</span>
          </div>
          <p className="privacy-lead-paragraph">
            {isHindi
              ? "यह गोपनीयता नीति आपकी जानकारी के संग्रह, उपयोग और प्रकटीकरण पर हमारी नीतियों और प्रक्रियाओं का वर्णन करती है जब आप सेवा का उपयोग करते हैं और आपको आपके गोपनीयता अधिकारों और कानून आपकी सुरक्षा कैसे करता है, इसके बारे में सूचित करती है।"
              : "This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You."}
          </p>
        </div>

        {/* Quick Highlights Summary Box */}
        <div className="privacy-summary-box">
          <h3>
            <i className="fa-solid fa-circle-check text-green"></i>{" "}
            {isHindi ? "मुख्य गोपनीयता बिंदु (Key Highlights)" : "Privacy at a Glance"}
          </h3>
          <div className="summary-grid">
            <div className="summary-card">
              <i className="fa-solid fa-lock text-green"></i>
              <strong>{isHindi ? "डेटा सुरक्षा" : "Enterprise Security"}</strong>
              <p>{isHindi ? "सभी डेटा एन्क्रिप्टेड और सुरक्षित हैं।" : "AES-256 encryption on all stored drafts and researcher data."}</p>
            </div>
            <div className="summary-card">
              <i className="fa-solid fa-ban text-green"></i>
              <strong>{isHindi ? "नो डेटा शेयरिंग" : "Zero SMS/Mobile Sharing"}</strong>
              <p>{isHindi ? "आपका फोन नंबर कभी तीसरे पक्ष को नहीं दिया जाता।" : "Mobile data is strictly never sold or shared with 3rd parties."}</p>
            </div>
            <div className="summary-card">
              <i className="fa-solid fa-user-shield text-green"></i>
              <strong>{isHindi ? "उपयोगकर्ता नियंत्रण" : "Your Rights"}</strong>
              <p>{isHindi ? "किसी भी समय अपना डेटा डिलीट या संशोधित करें।" : "Full right to access, export, or permanently delete your data."}</p>
            </div>
            <div className="summary-card">
              <i className="fa-solid fa-envelope text-green"></i>
              <strong>{isHindi ? "सीधा संपर्क" : "Direct Support"}</strong>
              <p>godhaniswapnil53@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Section 1: Interpretation and Definitions */}
        <section className="privacy-section">
          <h2>1. Interpretation and Definitions</h2>
          <h3>Interpretation</h3>
          <p>
            The words whose initial letters are capitalized have meanings defined under the following conditions.
            The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
          </p>
          <h3>Definitions</h3>
          <p>For the purposes of this Privacy Policy:</p>
          <ul className="privacy-list">
            <li>
              <strong>Account:</strong> A unique account created for You to access Our Service or parts of Our Service.
            </li>
            <li>
              <strong>Affiliate:</strong> An entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.
            </li>
            <li>
              <strong>Application:</strong> Refers to <em>AI Research Assistant</em> (ThesisMate), the software program provided by the Company.
            </li>
            <li>
              <strong>Company:</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Privacy Policy) refers to AI Research Assistant.
            </li>
            <li>
              <strong>Country/State:</strong> Refers to <strong>Gujarat, India</strong>.
            </li>
            <li>
              <strong>Device:</strong> Any device that can access the Service, such as a computer, a cell phone or a digital tablet.
            </li>
            <li>
              <strong>Personal Data (or "Personal Information"):</strong> Any information that relates to an identified or identifiable individual.
            </li>
            <li>
              <strong>Service:</strong> Refers to the Application and AI Research Workspace.
            </li>
            <li>
              <strong>Service Provider:</strong> Any natural or legal person who processes the data on behalf of the Company to facilitate the Service or assist in analyzing usage.
            </li>
            <li>
              <strong>Usage Data:</strong> Data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).
            </li>
            <li>
              <strong>User / You:</strong> The individual accessing or using the Service, or the university, company, or legal entity on behalf of which such individual is accessing the Service.
            </li>
          </ul>
        </section>

        {/* Section 2: Collecting and Using Your Personal Information */}
        <section className="privacy-section">
          <h2>2. Collecting and Using Your Personal Information</h2>
          <h3>Types of Data Collected</h3>
          <div className="privacy-subcard">
            <h4><i className="fa-solid fa-id-card"></i> Personal Data</h4>
            <p>
              While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include:
            </p>
            <ul>
              <li>Email address (e.g. university or institutional email)</li>
              <li>First name and last name</li>
            </ul>
          </div>

          <div className="privacy-subcard">
            <h4><i className="fa-solid fa-laptop-code"></i> Usage Data</h4>
            <p>
              Usage Data is collected automatically when using the Service. This may include Your Device's Internet Protocol (IP) address, browser type, browser version, pages of Our Service visited, time and date of visits, time spent on pages, unique device identifiers, and diagnostic telemetry.
            </p>
          </div>

          <div className="privacy-subcard">
            <h4><i className="fa-solid fa-cookie-bite"></i> Tracking Technologies &amp; Cookies</h4>
            <p>
              We use session cookies and local storage tokens to maintain authenticated sessions and remember user preferences (such as language selection).
            </p>
          </div>
        </section>

        {/* Section 3: Use of Your Personal Data */}
        <section className="privacy-section">
          <h2>3. Use of Your Personal Data</h2>
          <p>The Company may use Personal Data for the following operational purposes:</p>
          <ul className="privacy-list">
            <li><strong>To provide and maintain Our Service:</strong> Including monitoring the usage of our AI research pipeline and synthesis engine.</li>
            <li><strong>To manage Your Account:</strong> To authenticate your researcher profile and manage access to your saved dissertations, drafts, and libraries.</li>
            <li><strong>For the performance of a contract:</strong> To fulfill services or research workspace subscriptions requested through the platform.</li>
            <li><strong>To contact You:</strong> Via email or electronic notifications regarding critical security updates, feature improvements, or administrative messages.</li>
            <li><strong>To manage Your requests:</strong> To attend to customer support and technical research inquiries.</li>
            <li><strong>For business evaluations:</strong> To analyze usage trends, measure prompt processing efficiency, and improve document generation accuracy.</li>
          </ul>
        </section>

        {/* Section 4: Text Messages (SMS) Privacy Notice */}
        <section className="privacy-section highlight-section">
          <h2><i className="fa-solid fa-comment-sms text-green"></i> 4. Text Messages Privacy Notice</h2>
          <p>
            If You opt in to receive text (SMS) messages from Us, We will collect and store Your phone number and consent timestamps.
          </p>
          <div className="privacy-alert-box">
            <strong>Strict Non-Sharing Commitment:</strong> No mobile information will be shared with or sold to third parties or affiliates for marketing or promotional purposes. The phone numbers and consent records We collect for texting are never shared with anyone for any purpose, except the Service Providers that technically have to handle them to deliver the texts.
          </div>
          <p>SMS notifications are strictly limited to:</p>
          <ul>
            <li>Account security alerts and one-time verification passcodes (OTP)</li>
            <li>Customer care and research workspace notifications</li>
            <li>Document rendering completion updates</li>
          </ul>
          <p className="privacy-optout-note">
            Reply <strong>STOP</strong> at any time to opt-out. Reply <strong>HELP</strong> for support. Message and data rates may apply.
          </p>
        </section>

        {/* Section 5: Retention & Deletion of Your Personal Data */}
        <section className="privacy-section">
          <h2>5. Retention and Deletion of Your Personal Data</h2>
          <p>
            The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy.
          </p>
          <div className="retention-table-wrapper">
            <table className="retention-table">
              <thead>
                <tr>
                  <th>Data Category</th>
                  <th>Maximum Retention Period</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>User Account Information</strong></td>
                  <td>Duration of account + up to 24 months</td>
                  <td>Account relationship, support, dispute resolution</td>
                </tr>
                <tr>
                  <td><strong>Customer Support Correspondence</strong></td>
                  <td>Up to 24 months from ticket closure</td>
                  <td>Quality assurance, staff training, inquiry follow-up</td>
                </tr>
                <tr>
                  <td><strong>Application Usage Telemetry</strong></td>
                  <td>Up to 24 months</td>
                  <td>Feature adoption analytics and security monitoring</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: "16px" }}>
            Upon expiration of retention periods or upon verified user request, personal data is permanently deleted or irreversibly anonymized.
          </p>
        </section>

        {/* Section 6: Security and Transfers */}
        <section className="privacy-section">
          <h2>6. Data Security and International Transfers</h2>
          <p>
            Your information is processed at the Company's operating facilities in <strong>Gujarat, India</strong> and authorized cloud infrastructure. We implement commercial-grade encryption and administrative safeguards to ensure that all data is treated securely in accordance with this Privacy Policy.
          </p>
          <div className="privacy-alert-box">
            <strong>Security Disclaimer:</strong> While We strive to use commercially acceptable means to protect Your Personal Data, no method of transmission over the Internet or electronic storage is 100% secure, and We cannot guarantee absolute security.
          </div>
        </section>

        {/* Section 7: Third-Party Service Providers */}
        <section className="privacy-section">
          <h2>7. Third-Party Service Providers</h2>
          <p>
            We may employ third-party service providers (such as academic repository APIs and Google Places) to facilitate our research services. These third-party vendors access data strictly to perform assigned tasks and are bound by confidentiality obligations.
          </p>
          <ul>
            <li>
              <strong>Google Places &amp; Google Services:</strong> Handled in accordance with Google's Privacy Policy at{" "}
              <a href="https://www.google.com/intl/en/policies/privacy/" target="_blank" rel="noopener noreferrer">
                https://www.google.com/intl/en/policies/privacy/
              </a>.
            </li>
          </ul>
        </section>

        {/* Section 8: Children's and Minors' Privacy */}
        <section className="privacy-section">
          <h2>8. Children's and Minors' Privacy</h2>
          <p>
            Our Service is not directed to individuals under the age of 16. We do not knowingly collect personal information from minors under 16. If You become aware that a minor has provided us with Personal Data, please contact us immediately to have the data removed.
          </p>
        </section>

        {/* Section 9: Changes to this Privacy Policy */}
        <section className="privacy-section">
          <h2>9. Changes to this Privacy Policy</h2>
          <p>
            We may update Our Privacy Policy periodically. We will notify You of any material changes by updating the "Last updated" date at the top of this document or posting a prominent notice on the Service.
          </p>
        </section>

        {/* Section 10: Contact Us */}
        <section className="privacy-section contact-highlight-section">
          <h2>10. Contact Us</h2>
          <p>If You have questions, feedback, or requests regarding this Privacy Policy, please contact our Data Protection team:</p>
          <div className="contact-info-card">
            <div className="contact-item">
              <i className="fa-solid fa-envelope text-green"></i>
              <div>
                <strong>Email Address:</strong>
                <p><a href="mailto:godhaniswapnil53@gmail.com">godhaniswapnil53@gmail.com</a></p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fa-solid fa-location-dot text-green"></i>
              <div>
                <strong>Location &amp; Jurisdiction:</strong>
                <p>Gujarat, India</p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fa-solid fa-globe text-green"></i>
              <div>
                <strong>Original Live Document:</strong>
                <p>
                  <a href={googleDocUrl} target="_blank" rel="noopener noreferrer">
                    View on Google Docs ↗
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Back Action */}
        <div className="privacy-footer-action">
          <button className="btn-primary" onClick={() => onNavigate("home")}>
            <i className="fa-solid fa-arrow-left"></i> {isHindi ? "होम पेज पर वापस जाएं" : "Return to ThesisMate Home"}
          </button>
        </div>
      </div>
    </div>
  );
}
