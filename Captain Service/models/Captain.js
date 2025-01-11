const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const connection=require('../db/connection')
const captainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        set: value => bcrypt.hashSync(value, 10)
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: false
    }
})
module.exports=mongoose.model('User',captainSchema)