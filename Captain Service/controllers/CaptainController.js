const Captain = require('../models/Captain');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rabbitMQ=require('../service/rabbit');
require('dotenv').config();

module.exports.RenewAccessToken=async(req,res)=>{
    const refreshToken=req.body.refreshToken;
    const refreshTokenFromDB=await RefreshToken.findOne({refreshToken:refreshToken});
    if(!refreshTokenFromDB){
        return res.status(400).json({message:'Invalid refresh token'});
    }
    try{
        const decodedRefreshToken=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign({ email:decodedRefreshToken.email,id:decodedRefreshToken.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3m' });
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
        const accessToken = jwt.sign({ email:captain.email,id:captain._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3m' });
        const refreshToken = jwt.sign({ email:captain.email,id:captain._id }, process.env.REFRESH_TOKEN_SECRET);
        const token=new RefreshToken({refreshToken:refreshToken,captainId:captain._id});
        token.save();
        res.status(200).json({ accessToken, refreshToken });
    }
    catch(error){
        res.status(500).send(error);
    }
}
module.exports.toggleAvailability=async(req,res)=>{
    try{
        const token=req.headers.authorization&&req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message:'Unauthorized'});
        }
        const decodedAcessToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const captain=await Captain.findById(decodedAcessToken.id);
        if(captain.isAvailable){
            captain.isAvailable=false;
        }
        else{
            captain.isAvailable=true;
            const newRide=await rabbitMQ.subscribeToQueue('ride',async (message)=>{
                let rideDetails=JSON.parse(message.content);
                captain.isAvailable=false;
                captain.save();
                console.log('Ride details:',rideDetails._id);
                rideDetails=await axios.post('${RIDE_SERVICE_URL}/acceptRide',
                    {rideDetails},
                    {headers:{Authorization:`Bearer ${token}`}});
            })
            //subscribe to the queue by long polling
        }
        await captain.save();
        res.status(200).json({message:'Availability toggled successfully'});
    }
    catch(error){
        res.status(500).send(error);
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
    return jwt.sign({ email: captain.email, id: captain._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3m' });
}
function generateRefreshToken(captain) {
    return jwt.sign({ email: captain.email, id: captain._id }, process.env.REFRESH_TOKEN_SECRET);
}