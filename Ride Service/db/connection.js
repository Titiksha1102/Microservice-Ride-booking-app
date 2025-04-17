const mongoose = require('mongoose');

const connect=async()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/ride-service');
        console.log('Ride service MongoDB connected');
    } catch (error) {
        console.log('Ride service MongoDB connection error:',error);
    }
}


module.exports = connect;