const mongoose = require('mongoose');

const connect=async()=>{
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('MongoDB connected');
    } catch (error) {
        console.log('MongoDB connection error:',error);
    }
}


module.exports = connect;