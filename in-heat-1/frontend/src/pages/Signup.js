import React, { useState } from "react";
import "./Signup.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Split name into firstName and lastName for backend
    const parseName = (fullName) => {
        const parts = fullName.trim().split(" ");
        return {
            firstName: parts[0] || "",
            lastName: parts.slice(1).join(" ") || "",
        };
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        const { firstName, lastName } = parseName(name);
        try {
            const res = await fetch("http://localhost:3001/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    username: email, // using email as username
                    password,
                    userType: "buyer"
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("Registration successful! You can now log in.");
                setName("");
                setEmail("");
                setPassword("");
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
                    placeholder="Full Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
                {message && <p style={{ color: message.includes("success") ? "green" : "red" }}>{message}</p>}
                <p>Already have an account? <a href="/login">Login</a></p>
            </form>
        </div>
    );
}

export default Register;
