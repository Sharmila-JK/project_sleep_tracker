const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name : { type: String, required: true },
    email : { type: String, required: true, unique: true },
    phoneNumber : { type: Number },
    location : { type: String },
    password : { type: String, required: true },
    resetPasswordToken : { type: String },
    resetPasswordExpires : { type: Date }
})


module.exports = mongoose.model('customer', customerSchema)