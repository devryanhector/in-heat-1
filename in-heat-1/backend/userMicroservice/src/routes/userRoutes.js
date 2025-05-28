const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUsersByType,
    searchUsers,
    getAllUsers,
    updateUserType,
    deleteUser
} = require('../controllers/userController');
const User = require('../models/User');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.headers['user-id']);
        if (!user || user.userType !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin privileges required.'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            message: 'Error checking admin status',
            error: error.message
        });
    }
};

// Search users
router.get('/search', searchUsers);

// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile
router.get('/:userId', getUserProfile);

// Update user profile
router.put('/:userId', updateUserProfile);

// Get users by type (buyer/seller)
router.get('/type/:userType', getUsersByType);

// Admin routes
router.get('/', isAdmin, getAllUsers);
router.put('/:userId/type', isAdmin, updateUserType);
router.delete('/:userId', isAdmin, deleteUser);

module.exports = router; 