const express = require('express');
const router = express.Router();
const RideController = require('../controllers/RideController');
const routeGuards = require('../middleware/routeGuards');

// Create a new ride
router.post('/createRide',routeGuards.userLoggedIn,RideController.createRide);

// Accept a ride (to be accessed by captain)
router.post('/:id/accept', RideController.acceptRide);

// Cancel a ride (can be accessed by both user and captain)
router.post('/:id/cancel', RideController.cancelRide);

module.exports = router;
