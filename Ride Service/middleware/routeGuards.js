const axios = require('axios');
module.exports.userLoggedIn= async (req, res, next) => {
    const token = req.headers.authorization&&req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: 'You are not logged in'
        });
    }
    const user=axios.get(`${process.env.USER_SERVICE_URL}/profile`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log(user);
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