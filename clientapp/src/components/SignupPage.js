import React, { useState } from "react";
import { register } from "../services/authService";
import { translations } from "../translations";

export default function SignupPage({ onNavigate, onLogin, t, lang = "EN" }) {
  const activeT = t || translations[lang] || translations.EN;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg(lang === "HI" ? "पासवर्ड मेल नहीं खाते हैं।" : "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg(lang === "HI" ? "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।" : "Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await register(fullName.trim(), email.trim(), password);

      setSuccessMsg(lang === "HI" ? "खाता सफलतापूर्वक बन गया! रीडायरेक्ट हो रहा है..." : "Account created successfully! Redirecting...");

      if (data && data.token) {
        localStorage.setItem("token", data.token);
        const userObj = data.user || { fullName: fullName.trim(), email: email.trim() };
        userObj.isNewUser = true;
        localStorage.setItem("user", JSON.stringify(userObj));

        setTimeout(() => {
          if (onLogin) {
            onLogin(userObj);
          }
          onNavigate("dashboard");
        }, 1000);
      } else {
        setTimeout(() => {
          onNavigate("login");
        }, 1200);
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else if (err.message) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg(lang === "HI" ? "पंजीकरण विफल रहा। कृपया सर्वर कनेक्शन जांचें।" : "Failed to register. Please check server connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button className="back-btn" onClick={() => onNavigate("home")}>
          ← {activeT.dashBackHome || "Back to home"}
        </button>

        <div className="login-header">
          <div className="logo" style={{ justifyContent: "center", marginBottom: "1rem" }}>
            <div className="logo-icon">1</div> ThesisMate
          </div>
          <h2>{activeT.signupTitle || "Create Account"}</h2>
          <p>{activeT.signupSubtitle || "Join scholars worldwide drafting verifiable academic papers"}</p>
        </div>

        <form onSubmit={handleRegister} className="login-form">
          {errorMsg && <div className="form-error">{errorMsg}</div>}
          {successMsg && <div className="form-success">{successMsg}</div>}

          <div className="form-group">
            <label htmlFor="fullName">{activeT.fullNameLabel || "Full Name"}</label>
            <input
              type="text"
              id="fullName"
              placeholder="e.g. Dr. Alex Morgan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{activeT.emailLabel || "Email address"}</label>
            <input
              type="email"
              id="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{activeT.passwordLabel || "Password"} (min. 6)</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{activeT.confirmPasswordLabel || "Confirm Password"}</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "..." : (activeT.signupBtn || "Create Account →")}
          </button>
        </form>

        <p className="login-footer">
          {activeT.alreadyHaveAccount || "Already have an account?"}{" "}
          <span
            onClick={() => onNavigate("login")}
            style={{ textDecoration: "underline", cursor: "pointer", fontWeight: "600", color: "var(--accent-dark)" }}
          >
            {activeT.signInLink || "Log in here"}
          </span>
        </p>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "0.8rem", color: "var(--text-light)" }}>
          <span
            onClick={() => onNavigate("privacy")}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            {activeT.privacyPolicyTitle || "Privacy Policy"}
          </span>
        </p>
      </div>
    </div>
  );
}