const axios = require('axios');
const Ride=require('../models/Ride')
module.exports.userLoggedIn= async (req, res, next) => {
    const accessToken=req.headers.authorization && req.headers.authorization.split(' ')[1]
    const refreshTokenInCookie=req.cookies.refreshToken


    if (!accessToken) {
        return res.status(401).json({
            message: 'You are not logged in or token not retrieved correctly'
        });
    }
    const response=await axios.get(`${process.env.USER_SERVICE_URL}/profile`,{
        headers: {
            Cookie: req.headers.cookie,
            Authorization: `Bearer ${accessToken}`
        },
        withCredentials: true
    })
    const user=response.data
    if (!user) {
        return res.status(401).json({
            message: 'You are not logged in'
        });
    }
    //req.body.userId=user._id;
    next();
}
module.exports.captainLoggedIn= async (req, res, next) => {
    const token = req.headers.authorization&&req.headers.authorization.split(' ')[1];
    console.log("captain's token:",token)
    if (!token) {
        return res.status(401).json({
            message: 'You are not logged in'
        });
    }
    const captain=axios.get(`${process.env.CAPTAIN_SERVICE_URL}/profile`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log(captain);
    if (!captain) {
        return res.status(401).json({
            message: 'You are not logged in'
        });
    }
    //req.body.captainId=captain._id;
    next();
}
module.exports.rideExists= async (req, res, next) => {
    
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
        return res.status(404).send();
    }
    next();
}