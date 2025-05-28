import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Register() {
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("buyer");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("http://localhost:3001/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    middleName,
                    lastName,
                    username,
                    password,
                    userType
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("Registration successful! Redirecting to products...");
                setFirstName("");
                setMiddleName("");
                setLastName("");
                setUsername("");
                setPassword("");
                setUserType("buyer");
                setTimeout(() => navigate("/"), 1000);
            } else {
                setMessage(data.message || "Registration failed.");
            }
        } catch (err) {
            setMessage("Error connecting to server.");
        }
        setLoading(false);
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <h2>Create Account</h2>
                <input
                    type="text"
                    placeholder="First Name"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Middle Name (optional)"
                    value={middleName}
                    onChange={e => setMiddleName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email (used as username)"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <select
                    value={userType}
                    onChange={e => setUserType(e.target.value)}
                    required
                >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                </select>
                <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
                {message && <p style={{ color: message.includes("success") ? "green" : "red" }}>{message}</p>}
                <p>Already have an account? <a href="/login">Login</a></p>
            </form>
        </div>
    );
}

export default Register;
