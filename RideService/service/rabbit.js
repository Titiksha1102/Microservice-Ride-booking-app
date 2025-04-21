const amqp = require('amqplib');

let channel, connection;

async function connect() {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('Ride service Connected to RabbitMQ');
    } catch (error) {
        console.error('Ride service Failed to connect to RabbitMQ', error);
    }
}

async function subscribeToQueue(queue, callback) {
    try {
        await channel.assertQueue(queue, { durable: true });
        channel.consume(queue, (message) => {
            if (message!=null) {
                console.log(message.content.toString());
                callback(message);
                channel.ack(message);
            }
        });
    } catch (error) {
        console.error('Ride service Failed to subscribe to queue', error);
    }
}

async function publishToQueue(queue, message) {
    try {
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
        console.log('Ride service Published to queue');
    } catch (error) {
        console.error('Ride service Failed to publish to queue', error);
    }
}



module.exports = {
    connect,
    subscribeToQueue,
    publishToQueue
};
