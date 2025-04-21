const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const connection=require('../db/connection')
const userSchema = new mongoose.Schema({
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
    }
})
module.exports=mongoose.model('User',userSchema)