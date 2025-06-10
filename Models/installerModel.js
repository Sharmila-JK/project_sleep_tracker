const mongoose = require('mongoose')

const installerSchema = new mongoose.Schema({
    name : { type: String, required: true },
    email : { type: String, unique: true },
    phoneNumber : { type: Number },
    location : { type: String },
    serviceArea: {
        type: [String],
        enum: [
            "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
            "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
            "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
            "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
            "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
            "Thanjavur", "Thiruvannamalai", "Thiruvarur", "Thoothukudi", "Tiruchirappalli",
            "Tirunelveli", "Tirupathur", "Tiruppur", "Thiruvallur", "Vellore", "Villupuram",
            "Virudhunagar", "Sattur"
        ] },
    password : { type: String, required: true },
    resetPasswordToken : { type: String },
    resetPasswordExpires : { type: Date },
    accessToken : { type: String }
})


module.exports = mongoose.model('installer', installerSchema)