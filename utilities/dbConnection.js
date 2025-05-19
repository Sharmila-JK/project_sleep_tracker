const mongoose = require('mongoose')
const dotenv = require('dotenv')
const constants = require('./constants')
dotenv.config()

const dbURL = process.env.DB_URL

let connection = {}

connection.dbConnect = async () => {
    console.log("DB connection status " + mongoose.connection.readyState )
    if ( mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3 ) {
        try {
            await mongoose.connect(dbURL)
        }
        catch (error) {
            let err = new Error(constants.DB_ERR)
            err.error = error.message
            return { flag : false, error: err }
        }
    }
    
}

module.exports = connection