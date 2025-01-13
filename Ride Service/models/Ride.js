const mongoose = require('mongoose');
const locationSchema = require('./Location');
const rideSchema=new mongoose.Schema({
    captainId: {
        type: String
    },
    userId: {
        type: String,
        required: true
    },
    pickup: {
        type: locationSchema,
        required: true
    },
    drop:{
        type: locationSchema,
        required: true
    },
    status:{
        type: String,
        enum:['requested','accepted','arrived','started','completed','cancelled by captain','cancelled by user'],   
        default:'requested'
    },
    fare:{
        type:Number
    },
})
module.exports = mongoose.model('Ride', rideSchema);