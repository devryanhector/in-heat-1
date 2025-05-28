const User = require('../models/User');

// Register new user
const registerUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();

        // Publish user.registered event
        const channel = req.app.get('channel');
        channel.publish('user_events', 'user.registered', Buffer.from(JSON.stringify({
            userId: user._id,
            username: user.username,
            userType: user.userType
        })));

        res.status(201).json({
            message: 'User registered successfully',
            userId: user._id
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error registering user',
            error: error.message
        });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(401).json({
                message: 'Invalid username or password'
            });
        }

        // Publish user.login event
        const channel = req.app.get('channel');
        channel.publish('user_events', 'user.login', Buffer.from(JSON.stringify({
            userId: user._id,
            username: user.username,
            userType: user.userType
        })));

        res.json({
            message: 'Login successful',
            userId: user._id,
            userType: user.userType
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error during login',
            error: error.message
        });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user profile',
            error: error.message
        });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            req.body,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Publish user.updated event
        const channel = req.app.get('channel');
        channel.publish('user_events', 'user.updated', Buffer.from(JSON.stringify({
            userId: user._id,
            username: user.username,
            userType: user.userType
        })));

        res.json({
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user profile',
            error: error.message
        });
    }
};

// Get users by type
const getUsersByType = async (req, res) => {
    try {
        const users = await User.find({
            userType: req.params.userType
        }).select('-password');
        
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// Search users by username
const searchUsers = async (req, res) => {
    try {
        const { username } = req.query;
        const user = await User.findOne({ 
            username: new RegExp(`^${username}$`, 'i') 
        }).select('_id username userType');
        
        if (!user) {
            return res.json({ userId: null });
        }
        
        res.json({
            userId: user._id,
            username: user.username,
            userType: user.userType
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error searching users',
            error: error.message
        });
    }
};

// Admin functions

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// Update user type
const updateUserType = async (req, res) => {
    try {
        const { userType } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { userType },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Publish user.type.updated event
        const channel = req.app.get('channel');
        channel.publish('user_events', 'user.type.updated', Buffer.from(JSON.stringify({
            userId: user._id,
            username: user.username,
            userType: user.userType
        })));

        res.json({
            message: 'User type updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user type',
            error: error.message
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Publish user.deleted event
        const channel = req.app.get('channel');
        channel.publish('user_events', 'user.deleted', Buffer.from(JSON.stringify({
            userId: user._id,
            username: user.username
        })));

        res.json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUsersByType,
    searchUsers,
    // Admin functions
    getAllUsers,
    updateUserType,
    deleteUser
}; 