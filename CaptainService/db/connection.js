const mongoose = require('mongoose');

const connect=async()=>{
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Captain service MongoDB connected');
    } catch (error) {
        console.log('Captain service MongoDB connection error:',error);
    }
}


module.exports = connect;