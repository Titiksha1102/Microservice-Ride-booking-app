const amqp = require('amqplib');

let channel, connection;

async function connect() {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('User service Connected to RabbitMQ');
    } catch (error) {
        console.error('User service Failed to connect to RabbitMQ', error);
    }
}

async function subscribeToQueue(queue, callback) {
    try {
        await channel.assertQueue(queue, { durable: true });
        channel.consume(queue, (message) => {
            if (message!=null) {
                console.log(message.content.toString());
                
                channel.ack(message);
                callback(message);
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
        console.log('User service Published to queue');
    } catch (error) {
        console.error('User service Failed to publish to queue', error);
    }
}



module.exports = {
    connect,
    subscribeToQueue,
    publishToQueue
};
