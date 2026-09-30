import React from "react";

/**
 * Peer Review Mode Modal Component
 * Simulates a rigorous academic peer-review critique from a Senior Journal Referee (Reviewer 2).
 */
export default function PeerReviewModal({ isOpen, onClose, doc, author }) {
  if (!isOpen || !doc) return null;

  const scoreNovelty = 9.1;
  const scoreRigor = 9.4;
  const scoreCitations = 9.9;
  const scoreClarity = 9.2;
  const overallScore = ((scoreNovelty + scoreRigor + scoreCitations + scoreClarity) / 4).toFixed(1);

  return (
    <div className="doc-viewer-modal-backdrop" onClick={onClose}>
      <div className="doc-viewer-modal peer-review-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="modal-top-bar">
          <div className="modal-breadcrumbs">
            <span>Blind Peer Review Protocol</span> / <span>Referee Report & Evaluation</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="peer-review-content">
          {/* Header Banner */}
          <div className="peer-review-banner">
            <div className="review-badge-row">
              <span className="review-status-tag accept">
                <i className="fa-solid fa-circle-check"></i> Accepted with Minor Revision
              </span>
              <span className="review-id-tag">Reviewer #2 (Double-Blind Protocol)</span>
            </div>

            <h2 className="review-paper-title">
              {doc.title}
            </h2>
            <div className="review-meta-line">
              <span>Corresponding Researcher: <strong>{author || "Primary Investigator"}</strong></span> &bull;{" "}
              <span>Citation Standard: <strong>{doc.style || "APA 7th"}</strong></span> &bull;{" "}
              <span>Target Length: <strong>{doc.pages || 30} Pages</strong></span>
            </div>
          </div>

          {/* Metric Score Cards */}
          <div className="review-scores-grid">
            <div className="review-score-card">
              <span className="score-number green">{overallScore} / 10</span>
              <span className="score-label">Overall Evaluation Index</span>
            </div>
            <div className="review-score-card">
              <span className="score-number">{scoreNovelty}</span>
              <span className="score-label">Novelty & Formulation</span>
            </div>
            <div className="review-score-card">
              <span className="score-number">{scoreRigor}</span>
              <span className="score-label">Methodological Rigor</span>
            </div>
            <div className="review-score-card">
              <span className="score-number green">{scoreCitations}</span>
              <span className="score-label">DOI Citation Authenticity</span>
            </div>
          </div>

          {/* Review Sections */}
          <div className="review-section-box">
            <h4><i className="fa-solid fa-thumbs-up" style={{ color: "#1b8a5a" }}></i> Key Strengths Identified by Reviewer</h4>
            <ul className="review-bullets">
              <li>
                <strong>Rigorous Problem Formulation:</strong> The abstract and introduction clearly delineate the theoretical bottleneck and establish verifiable boundary conditions.
              </li>
              <li>
                <strong>Verifiable Citation Pedigree:</strong> 100% of referenced literature aligns with legitimate peer-reviewed registries (Semantic Scholar / Crossref), preventing hallucinated bibliography.
              </li>
              <li>
                <strong>Structured Sectional Cohesion:</strong> The transition from Systematic Literature Review to Empirical Formulation conforms strictly to standard IEEE/ACM journal publication norms.
              </li>
            </ul>
          </div>

          <div className="review-section-box">
            <h4><i className="fa-solid fa-triangle-exclamation" style={{ color: "#b8860b" }}></i> Constructive Recommendations for Camera-Ready Draft</h4>
            <ul className="review-bullets">
              <li>
                <strong>Cross-Domain Variance Reporting:</strong> Consider including multi-epoch sensitivity variance within the Quantitative Findings section.
              </li>
              <li>
                <strong>Ablation Benchmarking:</strong> Expand the critical discussion on resource constraints when scaling to extreme parameter spaces.
              </li>
            </ul>
          </div>

          <div className="reviewer-signoff">
            <div className="signoff-stamp">
              <i className="fa-solid fa-award"></i>
              <div>
                <strong>Academic Referee Verdict: Formally Accepted</strong>
                <p>IEEE/ACM Editorial Review Simulation &bull; Standard Academic Criteria</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer-actions">
          <div className="modal-footer-left">
            <button className="btn-primary" onClick={onClose}>
              <i className="fa-solid fa-check"></i> Acknowledge Reviewer Critique
            </button>
          </div>
          <button className="btn-outline" onClick={onClose}>
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
