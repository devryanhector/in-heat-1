const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqps://kaddtvmc:LXLGo2gGn0qaZtoTOEdncI-pOjuQhJCH@collie.lmq.cloudamqp.com/kaddtvmc';

let channel;

const connectQueue = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        // Declare exchanges for order events
        await channel.assertExchange('order_events', 'topic', { durable: true });

        // Listen for cart events
        await channel.assertExchange('cart_events', 'topic', { durable: true });
        const q = await channel.assertQueue('', { exclusive: true });

        await channel.bindQueue(q.queue, 'cart_events', 'cart.#');

        channel.consume(q.queue, (msg) => {
            const event = msg.fields.routingKey;
            const content = JSON.parse(msg.content.toString());

            console.log('Received cart event:', event, content);
            // Handle cart events as needed
        }, { noAck: true });

        console.log('Connected to RabbitMQ - Order Service');
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