const express = require('express');
const router = express.Router();
const CaptainController = require('../controllers/CaptainController');
const authentication = require('../middleware/authentication');

router.post('/login',authentication.captainNotLoggedIn, CaptainController.login);
router.post('/toggleAvailability',authentication.captainLoggedIn,CaptainController.toggleAvailability);
router.post('/logout',authentication.captainLoggedIn,CaptainController.logout);
// Create a new user
router.post('/register', CaptainController.registerCaptain);

// Get a user by ID
router.get('/profile',authentication.captainLoggedIn, CaptainController.Profile);

// Update a user by ID
router.put('/editprofile',authentication.captainLoggedIn, CaptainController.editProfile);
router.post('/renewaccesstoken', CaptainController.RenewAccessToken);
// Delete a user by ID
router.delete('/:id', CaptainController.deleteCaptainById);


module.exports = router;
