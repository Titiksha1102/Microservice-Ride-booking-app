
const Ride = require('../models/Ride');
const rabbitMQ = require('../service/rabbit');

// Create a new ride
exports.createRide = async (req, res) => {
    try {
        
        const ride = new Ride({
            userId: req.body.userId,
            pickup : req.body.pickup,
            drop: req.body.drop,
        });
        await ride.save();
        const message = JSON.stringify(ride.toJSON());
        await rabbitMQ.publishToQueue('ride', message);
        // await rabbitMQ.subscribeToQueue('ride', (message) => {
        //     console.log(message.content.toString());
        // });
        res.status(201).send("ride created and published to queue");
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

// Accept a ride (to be accessed by captain)
exports.acceptRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).send();
        }
        if (ride.status !== 'requested') {
            return res.status(400).send({ error: 'Ride cannot be accepted' });
        }
        ride.status = 'accepted';
        ride.captainId = req.captainId;
        await ride.save();
        res.send(ride);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Cancel a ride (can be accessed by both user and captain)
exports.cancelRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).send();
        }
        if (req.userId.equals(ride.userId) && (ride.status === 'requested' || ride.status === 'accepted')) {
            ride.status = 'canceled';
            await ride.save();
            return res.send(ride);
        }
        if (req.captainId.equals(ride.captainId) && ride.status === 'accepted') {
            ride.status = 'canceled';
            await ride.save();
            return res.send(ride);
        }
        res.status(400).send({ error: 'Ride cannot be canceled' });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.completeRide = async (req, res) => {
    try {
        const rideId=req.params.id;
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).send();
        }
        if (ride.status === 'accepted') {
            ride.status = 'completed';
            await ride.save();
            return res.send(ride);
        }
        res.status(400).send({ error: 'Ride cannot be completed' });
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
};