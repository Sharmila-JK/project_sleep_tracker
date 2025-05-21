const mongoose = require('mongoose')
const dotenv = require('dotenv')
const constants = require('./constants')
const formatError = require('./errorFormat');
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
            let err = formatError(constants.DB_ERR, error.message, constants.HTTP_SERVER_ERROR)
            return { flag : false, error: err }
        }
    }
    
}

module.exports = connection