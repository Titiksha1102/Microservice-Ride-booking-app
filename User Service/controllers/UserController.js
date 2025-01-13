const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports.login=async(req,res)=>{
    
    const {email,password}=req.body;
    try{
        const user = await User
            .findOne({ email })
            .select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        const token=new RefreshToken({refreshToken:refreshToken,userId:user._id});
        token.save();
        res.status(200).json({ accessToken, refreshToken });
    }
    catch(error){
        res.status(500).send(error);
    }
}
module.exports.logout=async(req,res)=>{
    try{
        const token=req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message:'Unauthorized'});
        }
        const decodedAcessToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user=await User.findById(decodedAcessToken.id);
        const userRefreshToken=await RefreshToken.findOne({userId:user._id});
        if(userRefreshToken){
            await RefreshToken.deleteOne({userId:user._id});
            res.status(200).json({message:'Logged out successfully'});
        }
        else{
            res.status(400).json({message:'User not logged in'});
        }
    }
    catch(error){
        res.status(500).send(error);
    }
}

module.exports.registerUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send("user registered successfully");
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports.Profile = async (req, res) => {
    try {
        const token = req.headers.authorization&&req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message:'Unauthorized'});
        }
        const decodedAcessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedAcessToken.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports.editProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedAcessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedAcessToken.id);
        if (!user) {
            return res.status(404).send();
        }
        const updates = Object.keys(req.body);
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();

        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};


module.exports.deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};
module.exports.RenewAccessToken=async(req,res)=>{
    try{
        const refreshToken=req.body.refreshToken;
        if(!refreshToken){
            return res.status(401).json({message:'Unauthorized'});
        }
        const decodedRefreshToken=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        const userRefreshToken=await RefreshToken.findOne({userId:decodedRefreshToken.id});
        if(!userRefreshToken){
            return res.status(401).json({message:'Unauthorized'});
        }
        const user=await User.findById(decodedRefreshToken.id);
        const accessToken = generateAccessToken(user)
        res.status(200).json({ accessToken });
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}
function generateAccessToken(user) {
    return jwt.sign({ email: user.email, id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}
function generateRefreshToken(user) {
    return jwt.sign({ email: user.email, id: user._id }, process.env.REFRESH_TOKEN_SECRET);
}