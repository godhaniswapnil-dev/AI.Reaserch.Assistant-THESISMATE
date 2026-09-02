import React, { useState } from "react";

export default function Dashboard({ username, onLogout, onNavigate }) {
    const [documents, setDocuments] = useState([
        {
            id: 1,
            title: "Comprehensive Analysis of the Sharing Economy: Benefits & Disparities",
            pages: 42,
            style: "APA 7th",
            citations: 128,
            status: "Verified",
            date: "May 14, 2026",
        },
        {
            id: 2,
            title: "Neural Architecture Search for Low-Power Edge Devices",
            pages: 28,
            style: "IEEE",
            citations: 86,
            status: "Drafting",
            date: "June 02, 2026",
        },
    ]);

    const [prompt, setPrompt] = useState("");

    const handleCreateDocument = (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        const newDoc = {
            id: Date.now(),
            title: prompt,
            pages: 35,
            style: "APA 7th",
            citations: 94,
            status: "Generating",
            date: "Just now",
        };

        setDocuments([newDoc, ...documents]);
        setPrompt("");
        alert(`Drafting started for: "${prompt}". Sources being gathered via Semantic Scholar.`);
    };

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-header">
                <div>
                    <h2>Research Workspace</h2>
                    <p>Welcome back, <strong>{username}</strong>. You have 80 pages quota available.</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="btn-outline" onClick={() => onNavigate("home")}>
                        View Homepage
                    </button>
                    <button className="btn-primary" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="dashboard-prompt-card">
                <h3>Start a New Scientific Draft</h3>
                <p>Enter your research topic, thesis question, or hypothesis below:</p>
                <form onSubmit={handleCreateDocument} style={{ display: "flex", gap: "12px", marginTop: "15px" }}>
                    <input
                        type="text"
                        className="dashboard-input"
                        placeholder="e.g. Impact of Quantum Machine Learning on Drug Discovery Protocols..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary" style={{ whiteSpace: "nowrap" }}>
                        Generate Draft →
                    </button>
                </form>
            </div>

            <div className="dashboard-docs-list">
                <h3>Your Recent Documents</h3>
                <div className="docs-grid">
                    {documents.map((doc) => (
                        <div key={doc.id} className="doc-card">
                            <div className="doc-card-badge">{doc.status}</div>
                            <h4>{doc.title}</h4>
                            <div className="doc-card-meta">
                                <span><i className="fa-regular fa-file-lines"></i> {doc.pages} Pages</span>
                                <span><i className="fa-solid fa-quote-left"></i> {doc.style}</span>
                                <span><i className="fa-solid fa-check-double"></i> {doc.citations} Citations</span>
                            </div>
                            <div className="doc-card-footer">
                                <small>Updated: {doc.date}</small>
                                <button
                                    className="btn-outline"
                                    style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                                    onClick={() => alert(`Opening document: ${doc.title}`)}
                                >
                                    Open Editor
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}