const mongoose = require('mongoose');

const connect=async()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/captain-service');
        console.log('Captain service MongoDB connected');
    } catch (error) {
        console.log('Captain service MongoDB connection error:',error);
    }
}


module.exports = connect;