import React, { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setError("You are not logged in.");
            setLoading(false);
            return;
        }
        fetch(`http://localhost:3001/users/${userId}`)
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Error loading profile.");
                setLoading(false);
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userId");
        window.location.href = "/login";
    };

    if (loading) return <div className="profile-container">Loading...</div>;
    if (error) return <div className="profile-container" style={{ color: "red" }}>{error}</div>;
    if (!user) return <div className="profile-container">Profile not found</div>;

    // Show profile for all user types (buyer, seller, admin)
    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-avatar">
                    <span>{user.firstName?.[0] || user.username?.[0] || "U"}</span>
                </div>
                <h2>{user.firstName || ""} {user.middleName ? user.middleName + " " : ""}{user.lastName || ""}</h2>
                <p className="profile-username">@{user.username}</p>
                <p className="profile-type">User Type: <b>{user.userType}</b></p>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Profile;