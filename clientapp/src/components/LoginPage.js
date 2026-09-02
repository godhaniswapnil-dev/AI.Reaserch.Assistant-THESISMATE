import React, { useState } from "react";
import { login } from "../services/authService";
import { translations } from "../translations";

export default function LoginPage({ onNavigate, onLogin, t, lang = "EN" }) {
  const activeT = t || translations[lang] || translations.EN;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const data = await login(email.trim(), password);

      if (data && data.token) {
        localStorage.setItem("token", data.token);
        const userObj = data.user || { email: email.trim(), fullName: email.trim().split("@")[0] };
        userObj.isNewUser = false;
        localStorage.setItem("user", JSON.stringify(userObj));

        if (onLogin) {
          onLogin(userObj);
        }
        onNavigate("dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        setErrorMsg(lang === "HI" ? "गलत ईमेल या पासवर्ड।" : "Incorrect email or password.");
      } else if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else if (error.message) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg(lang === "HI" ? "सर्वर से कनेक्ट करने में असमर्थ।" : "Unable to connect to server. Check backend connection.");
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
          <h2>{activeT.loginTitle || "Welcome back"}</h2>
          <p>{activeT.loginSubtitle || "Sign in to continue your research workspace"}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {errorMsg && <div className="form-error">{errorMsg}</div>}

          <div className="form-group">
            <label htmlFor="email">{activeT.emailLabel || "Email address"}</label>
            <input
              type="email"
              id="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{activeT.passwordLabel || "Password"}</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "..." : (activeT.loginBtn || "Login →")}
          </button>
        </form>

        <p className="login-footer">
          {activeT.dontHaveAccount || "Don't have an account?"}{" "}
          <span
            onClick={() => onNavigate("signup")}
            style={{ textDecoration: "underline", cursor: "pointer", fontWeight: "600", color: "var(--accent-dark)" }}
          >
            {activeT.signUpLink || "Sign up free"}
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
