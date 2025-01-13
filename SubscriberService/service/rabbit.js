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
        const qdetails=await channel.assertQueue(queue, { durable: true });
        
        channel.consume(queue, (message) => {
            if (message !== null) {
                console.log(qdetails.messageCount);
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
        const qdetails=await channel.assertQueue(queue, { durable: true });
        console.log(qdetails.messageCount);
        channel.sendToQueue(queue, Buffer.from(message));
    } catch (error) {
        console.error('Failed to publish to queue', error);
    }
}
async function clearQueue(queue) {
    try {
        const qdetails = await channel.assertQueue(queue, { durable: true });
        const purged = await channel.purgeQueue(queue);
        console.log(`Cleared ${purged.messageCount} messages from the queue: ${queue}`);
    } catch (error) {
        console.error('Failed to clear the queue', error);
    }
}


module.exports = {
    connect,
    subscribeToQueue,
    publishToQueue,
    clearQueue
};
