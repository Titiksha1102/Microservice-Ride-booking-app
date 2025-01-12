const amqp = require('amqplib');
require('dotenv').config();
let channel, connection;

async function connect() {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
    }
}

async function subscribeToQueue(queue, callback) {
    try {
        await channel.assertQueue(queue, { durable: true });
        channel.consume(queue, (message) => {
            if (message !== null) {
                
                channel.ack(message);
                callback(message.content.toString());
            }
        });
    } catch (error) {
        console.error('Failed to subscribe to queue', error);
    }
}

async function publishToQueue(queue, message) {
    try {
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(message));
    } catch (error) {
        console.error('Failed to publish to queue', error);
    }
}



module.exports = {
    connect,
    subscribeToQueue,
    publishToQueue
};
