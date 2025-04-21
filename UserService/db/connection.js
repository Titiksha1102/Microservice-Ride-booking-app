const mongoose = require('mongoose');

const connect=async()=>{
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('User service MongoDB connected');
    } catch (error) {
        console.log('User service MongoDB connection error:',error);
    }
}


module.exports = connect;