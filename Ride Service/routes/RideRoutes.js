const express = require('express');
const router = express.Router();
const RideController = require('../controllers/RideController');
const routeGuards = require('../middleware/routeGuards');

// Create a new ride
router.post('/createRide',routeGuards.userLoggedIn,RideController.createRide);

// Accept a ride (to be accessed by captain)
router.post('/accept/:id',routeGuards.captainLoggedIn, RideController.acceptRide);

// Cancel a ride (can be accessed by both user and captain)
router.post('/cancel/:id',routeGuards.rideExists,RideController.cancelRide);
router.post('/complete/:id',routeGuards.rideExists,RideController.completeRide)

module.exports = router;
