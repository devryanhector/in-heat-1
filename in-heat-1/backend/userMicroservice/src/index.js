const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./configs/mongodb.config');
const { connectQueue } = require('./configs/rabbitmq.config');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Connect to RabbitMQ and store channel
let channel;
async function setupRabbitMQ() {
    channel = await connectQueue();
    // Make channel available to routes
    app.set('channel', channel);
}
setupRabbitMQ();

// Routes
app.use('/users', userRoutes);

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'User Service is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`User Microservice running on port ${PORT}`);
}); 