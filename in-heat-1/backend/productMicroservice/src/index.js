const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./configs/mongodb.config');
const { connectQueue } = require('./configs/rabbitmq.config');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
// Increase payload size limit to 10MB
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

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
app.use('/products', productRoutes);

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Product Service is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Product Microservice running on port ${PORT}`);
}); 