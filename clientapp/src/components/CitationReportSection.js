import React from "react";

export default function CitationReportSection({ t }) {
  return (
    <section id="citations">
      <span className="subheading">{t.citSub}</span>
      <h2 className="section-title">
        {t.citTitlePrefix} <i>{t.citTitleItalic}</i>
      </h2>
      <p className="section-desc">
        {t.citDesc}
      </p>

      <div className="citation-grid">
        <div className="doc-preview">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "var(--text-light)",
              fontSize: "0.85rem",
              borderBottom: "1px solid #E2DDD0",
              paddingBottom: "15px",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "8px"
            }}
          >
            <span>thesismate.io/workspace</span>
            <span>Healthcare Equity - Review</span>
            <span>Sources (4)</span>
          </div>
          <h4>6.3 Healthcare Equity</h4>
          <p style={{ marginBottom: "15px" }}>
            Equity in healthcare refers to the principle that access to medical
            services and technologies should not be determined by socio-economic
            status.{" "}
            <span className="highlight-green">
              It demands that all individuals receive care of equal quality and
              timeliness
            </span>
            , regardless of their ability to pay. Yet achieving equity is complex
            when high-cost innovations and uneven infrastructure capacity
            introduce structural disparities{" "}
            <span className="highlight-yellow">(Brown, 2021, p. 78)</span>.
          </p>
          <p>
            These challenges multiply when new treatments emerge under
            intellectual property regimes granting exclusive rights{" "}
            <span className="highlight-red">
              (Johnson &amp; Lee, 2019, pp. 55-57)
            </span>
            , potentially delaying affordability...
          </p>
        </div>

        <div className="validation-cards">
          <div className="v-card green">
            <div className="v-title">{t.fullySupported}</div>
            <p>{t.fullySupportedDesc}</p>
            <div className="v-action">
              <span>Action</span>
              <span style={{ color: "var(--support-green)" }}>ⓘ Verified</span>
            </div>
          </div>

          <div className="v-card yellow">
            <div className="v-title">{t.partiallySupported}</div>
            <p>{t.partiallySupportedDesc}</p>
            <div className="v-action">
              <span>Action</span>
              <span style={{ color: "var(--support-yellow)" }}>ⓘ Rephrase</span>
            </div>
          </div>

          <div className="v-card red">
            <div className="v-title">{t.unsupportedClaim}</div>
            <p>{t.unsupportedClaimDesc}</p>
            <div className="v-action">
              <span>Action</span>
              <span style={{ color: "var(--support-red)" }}>ⓘ Review</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
