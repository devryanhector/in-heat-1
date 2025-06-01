const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://ryanhector:tFgvuLjxP2Fj7kA1@cluster0.x1g0ae4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB - Product Service');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = {
    connectDB,
    MONGODB_URL
}; 