import React, { useState } from "react";
import { login } from "../services/authService";

export default function LoginPage({ onNavigate, onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            const data = await login(email, password);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            onLogin(data.user.fullName);
            onNavigate("home");
        }
        catch (error) {
            console.log(error);

            if (error.response?.status === 401) {
                setErrorMsg("Incorrect email or password.");
            } else if (error.response?.data?.message) {
                setErrorMsg(error.response.data.message);
            } else {
                setErrorMsg("Unable to connect to server.");
            }
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">
                <div className="login-header">
                    <div className="logo" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                        <div className="logo-icon">1</div> ThesisMate
                    </div>
                    <h2>Welcome back</h2>
                    <p>Sign in to continue your research workspace</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {errorMsg && <div className="form-error">{errorMsg}</div>}

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
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#forgot" className="forgot-link">
                            Forgot password?
                        </a>
                    </div>

                    <button type="submit" className="btn-primary login-submit-btn">
                        Login →
                    </button>
                </form>

                <p className="login-footer">
                    Don't have an account?{' '}
                    <span
                        onClick={() => onNavigate('signup')}
                        style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: '600' }}
                    >
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
}