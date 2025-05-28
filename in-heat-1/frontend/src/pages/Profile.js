import React, { useEffect, useState } from 'react';
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Get userId from localStorage (set after login)
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('You are not logged in.');
            setLoading(false);
            return;
        }
        fetch(`http://localhost:3001/users/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.username) {
                    setUser(data);
                } else {
                    setError('Failed to load profile.');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Error connecting to server.');
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="profile-container">Loading...</div>;
    if (error) return <div className="profile-container" style={{color:'red'}}>{error}</div>;

    return (
        <div className="profile-container">
            <h2>My Profile</h2>
            <p>Name: {user.firstName} {user.lastName}</p>
            <p>Username: {user.username}</p>
            <p>User Type: {user.userType}</p>
            {/* Add edit profile functionality if needed */}
        </div>
    );
}

export default Profile;