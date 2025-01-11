const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authentication = require('../middleware/authentication');

router.post('/login',authentication.userNotLoggedIn, UserController.login);
router.post('/logout',authentication.userLoggedIn,UserController.logout);
// Create a new user
router.post('/register', UserController.registerUser);

// Get a user by ID
router.get('/profile',authentication.userLoggedIn, UserController.Profile);

// Update a user by ID
router.put('/editprofile',authentication.userLoggedIn, UserController.editProfile);
router.post('/renewaccesstoken',UserController.RenewAccessToken);
// Delete a user by ID
router.delete('/:id', UserController.deleteUserById);


module.exports = router;
