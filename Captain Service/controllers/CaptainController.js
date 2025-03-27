const Captain = require('../models/Captain');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rabbitMQ=require('../service/rabbit')
const axios=require('axios')
require('dotenv').config();

module.exports.RenewAccessToken=async(req,res)=>{
    const refreshToken=req.body.refreshToken;
    const refreshTokenFromDB=await RefreshToken.findOne({refreshToken:refreshToken});
    if(!refreshTokenFromDB){
        return res.status(400).json({message:'Invalid refresh token'});
    }
    try{
        const decodedRefreshToken=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        const captain=await Captain.findById(decodedRefreshToken.id)
        const accessToken =generateAccessToken(captain) 
        res.status(200).json({ accessToken });
    }
    catch(error){
        res.status(500).send(error);
    }
}
module.exports.login=async(req,res)=>{
    console.log('login');
    const {email,password}=req.body;
    try{
        const captain = await Captain
            .findOne({ email })
            .select('+password');

        if (!captain) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, captain.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const accessToken = generateAccessToken(captain)
        const refreshToken = generateRefreshToken(captain)
        const token=new RefreshToken({refreshToken:refreshToken,captainId:captain._id});
        token.save();
        res.status(200).json({ accessToken, refreshToken });
    }
    catch(error){
        res.status(500).send(error);
    }
}
module.exports.toggleAvailability = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decodedAccessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const captain = await Captain.findById(decodedAccessToken.id);

        // Toggle availability
        captain.isAvailable = !captain.isAvailable;
        await captain.save();

        // Only subscribe to queue if the captain becomes available
        

        res.status(200).json({ message: 'Availability toggled successfully' });
    } catch (error) {
        console.error('Error toggling availability:', error);
        res.status(500).json({ error: error.message });
    }
};
module.exports.listenToRides = async (req, res) => {
 try {
       const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
           if (!token) {
               return res.status(401).json({ message: 'Unauthorized' });
           }
   
           const decodedAccessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
           const captain = await Captain.findById(decodedAccessToken.id);
       if (captain.isAvailable) {
           console.log('Captain is now available, listening for ride requests...');
   
           rabbitMQ.subscribeToQueue('ride', async (message) => {
               if (!captain.isAvailable) {
                   console.log('Captain is no longer available, ignoring message.');
                   return;
               }
   
               // Parse the ride details
               const rides = JSON.parse(message.content);
               console.log('Ride available currently:', rides);
               res.status(200).json(rides)
               
           });
       }
 } catch (error) {
    console.log(error)
 }
}
module.exports.acceptRide=async (req,res)=>{
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
    
            const decodedAccessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const captain = await Captain.findById(decodedAccessToken.id);
        // Accept the ride and set captain as unavailable
        captain.isAvailable = false;
        await captain.save(); // Save the captain's updated status
    
        // Notify the ride service about the acceptance
        await axios.post(
            `${process.env.RIDE_SERVICE_URL}/accept/${rideDetails._id}`,{},
            { headers: { Authorization: `Bearer ${token}` } }
        );
    
        console.log('Ride accepted successfully.');
    } catch (error) {
        console.log(error)
    }
}
module.exports.logout=async(req,res)=>{
    try{
        const token=req.headers.authorization&&req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message:'Unauthorized'});
        }
        const decodedAcessToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const captain=await Captain.findById(decodedAcessToken.id);
        const CaptainRefreshToken=await RefreshToken.findOne({captainId:captain._id});
        if(CaptainRefreshToken){
            await RefreshToken.deleteOne({captainId:captain._id});
            res.status(200).json({message:'Logged out successfully'});
        }
        else{
            res.status(400).json({message:'Captain not logged in'});
        }
    }
    catch(error){
        res.status(500).send(error);
    }
}

module.exports.registerCaptain = async (req, res) => {
    try {
        console.log(req.body);
        const captain = new Captain(req.body);
        await captain.save();
        res.status(201).send("Captain registered successfully");
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports.Profile = async (req, res) => {
    try {
        const token=req.headers.authorization&&req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message:'Unauthorized'});
        }
        const decodedAcessToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const captain=await Captain.findById(decodedAcessToken.id);
        if (!captain) {
            return res.status(404).send();
        }
        res.send(captain);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports.editProfile = async (req, res) => {
    try {
        const token=req.headers.authorization&&req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message:'Unauthorized'});
        }
        const decodedAcessToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const captain = await Captain.findByIdAndUpdate(decodedAcessToken.id, req.body, { new: true });
        if (!captain) {
            return res.status(404).send();
        }
        res.send(captain);
    } catch (error) {
        res.status(400).send(error);
    }
};


module.exports.deleteCaptainById = async (req, res) => {
    try {
        const captain = await Captain.findByIdAndDelete(req.params.id);
        if (!captain) {
            return res.status(404).send();
        }
        res.send(clearIntervalaptain);
    } catch (error) {
        res.status(500).send(error);
    }
};

function generateAccessToken(captain) {
    return jwt.sign({ email: captain.email, id: captain._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}
function generateRefreshToken(captain) {
    return jwt.sign({ email: captain.email, id: captain._id }, process.env.REFRESH_TOKEN_SECRET);
}