const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

module.exports.userLoggedIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization&&req.headers.authorization.split(' ')[ 1 ];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decodedAcessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedAcessToken.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userRefreshToken = await RefreshToken.findOne({ userId: user._id });
        console.log(userRefreshToken);
        if(!userRefreshToken){
            return res.status(401).json({ message: 'User not logged in' });
        }
        req.user = user;

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.userNotLoggedIn = async (req, res, next) => {
    console.log('userNotLoggedIn');
    try {
        const email=req.body.email;
        const user = await User.findOne({ email:email });
        console.log(user);
        if (user) {
            const token=await RefreshToken.findOne({userId:user._id});
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
