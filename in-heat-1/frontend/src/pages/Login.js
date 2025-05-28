import React, { useState } from "react";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("http://localhost:3001/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: email, // using email as username
                    password
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("Login successful!");
                // Save userId to localStorage for session
                if (data.userId) localStorage.setItem('userId', data.userId);
            } else {
                setMessage(data.message || "Login failed.");
            }
        } catch (err) {
            setMessage("Error connecting to server.");
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                {message && <p style={{ color: message.includes("success") ? "green" : "red" }}>{message}</p>}
                <p>Don't have an account? <a href="/register">Register</a></p>
            </form>
        </div>
    );
}

export default Login;
