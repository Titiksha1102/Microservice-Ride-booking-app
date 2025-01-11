const jwt = require('jsonwebtoken');
const Captain = require('../models/Captain');
const RefreshToken = require('../models/RefreshToken');
require('dotenv').config();
module.exports.captainLoggedIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization&&req.headers.authorization.split(' ')[ 1 ];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decodedAcessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const captain = await Captain.findById(decodedAcessToken.id);
        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const captainRefreshToken = await RefreshToken.findOne({ captainId: captain._id });
        console.log(captainRefreshToken);
        if(!captainRefreshToken){
            return res.status(401).json({ message: 'User not logged in' });
        }
        req.user = captain;

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.captainNotLoggedIn = async (req, res, next) => {
    console.log('userNotLoggedIn');
    try {
        const email=req.body.email;
        const captain = await Captain.findOne({ email:email });
        console.log(captain);
        if (captain) {
            const token=await RefreshToken.findOne({captainId:captain._id});
            console.log(token);
            if (token) {
                console.log('You are already logged in.');
                return res.status(400).send({ error: 'You are already logged in.' });
            }
        }
        next();
    } catch (error) {
        next();
    }
};
