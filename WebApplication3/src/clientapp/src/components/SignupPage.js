import React, { useState } from "react";
import { register } from "../services/authService";

export default function SignupPage({ onNavigate, onLogin }) {
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
            setErrorMsg("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);

        try {
            const data = await register({
                fullName: fullName.trim(),
                email: email.trim(),
                password: password,
            });

            setSuccessMsg("Account created successfully! Redirecting...");

            // Automatically store session & log in
            if (data && data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                setTimeout(() => {
                    if (onLogin) {
                        onLogin(data.user.fullName || fullName);
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
                setErrorMsg("Failed to register. Please check server connection.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <button className="back-btn" onClick={() => onNavigate("home")}>
                    ← Back to home
                </button>

                <div className="login-header">
                    <div className="logo" style={{ justifyContent: "center", marginBottom: "1rem" }}>
                        <div className="logo-icon">1</div> ThesisMate
                    </div>
                    <h2>Create Account</h2>
                    <p>Join thousands of researchers drafting with ThesisMate</p>
                </div>

                <form onSubmit={handleRegister} className="login-form">
                    {errorMsg && <div className="form-error">{errorMsg}</div>}
                    {successMsg && <div className="form-success">{successMsg}</div>}

                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
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
                        <label htmlFor="email">Email address</label>
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
                        <label htmlFor="password">Password (min. 6 characters)</label>
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
                        <label htmlFor="confirmPassword">Confirm Password</label>
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
                        {isLoading ? "Creating Account..." : "Create Account →"}
                    </button>
                </form>

                <p className="login-footer">
                    Already have an account?{" "}
                    <span
                        onClick={() => onNavigate("login")}
                        style={{ textDecoration: "underline", cursor: "pointer", fontWeight: "600", color: "var(--accent-dark)" }}
                    >
                        Log in
                    </span>
                </p>
            </div>
        </div>
    );
}