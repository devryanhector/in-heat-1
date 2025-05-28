const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://ryanmangaoang0412:eTxOGPFALuMtuLin@in-heat.mjzzmip.mongodb.net/?retryWrites=true&w=majority&appName=in-heat';
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB - Cart Service');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = {
    connectDB,
    MONGODB_URL
}; 