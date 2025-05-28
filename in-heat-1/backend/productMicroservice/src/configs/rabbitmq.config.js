const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqps://kaddtvmc:LXLGo2gGn0qaZtoTOEdncI-pOjuQhJCH@collie.lmq.cloudamqp.com/kaddtvmc';

let channel;

const connectQueue = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        // Declare exchanges for product events
        await channel.assertExchange('product_events', 'topic', { durable: true });

        // Listen for user events
        await channel.assertExchange('user_events', 'topic', { durable: true });
        const q = await channel.assertQueue('', { exclusive: true });

        await channel.bindQueue(q.queue, 'user_events', 'user.#');

        channel.consume(q.queue, (msg) => {
            const event = msg.fields.routingKey;
            const content = JSON.parse(msg.content.toString());

            console.log('Received user event:', event, content);
            // Handle user events as needed
        }, { noAck: true });

        console.log('Connected to RabbitMQ - Product Service');
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