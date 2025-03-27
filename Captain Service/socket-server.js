const socket_server = require("socket.io")(4005, {
    cors: {
      origin: ["http://localhost:5173","http://localhost:5174"]
    }
  });
const amqp = require('amqplib');
require('dotenv').config();

let clientCount = 0;
let channel, connection;
const queue = 'ride'; // Define your queue name

// Connect to RabbitMQ
async function connectRabbitMQ() {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: true });
        console.log('Connected to RabbitMQ and queue asserted');

        // Consume messages once (not for each client)
        channel.consume(queue, (message) => {
            if (message !== null) {
                const rideData = message.content.toString();
                console.log(`New ride request: ${rideData}`);
                
                // Emit the ride request to all connected clients
                try {
                    socket_server.emit('new-ride-request-received', rideData);
                } catch (error) {
                    console.log(error)
                }
                
                console.log("emitted")
                // Acknowledge the message
                channel.ack(message);
            }
        });

    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
}

connectRabbitMQ();

// Handle new socket connections
socket_server.on('connection', (socket) => {
    clientCount++;
    console.log(`Client ${clientCount} connected: ${socket.id}`);
    
    // No need to call `consume` inside this block
});
