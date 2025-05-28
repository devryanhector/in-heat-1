const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqps://kaddtvmc:LXLGo2gGn0qaZtoTOEdncI-pOjuQhJCH@collie.lmq.cloudamqp.com/kaddtvmc';

let channel;

const connectQueue = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        // Declare exchanges for user events
        await channel.assertExchange('user_events', 'topic', { durable: true });

        console.log('Connected to RabbitMQ - User Service');
        return channel;
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
        process.exit(1);
    }
};

module.exports = {
    connectQueue,
    RABBITMQ_URL
}; 