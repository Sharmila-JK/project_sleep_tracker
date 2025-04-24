const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const dbURL = process.env.DB_URL

let connection = {}

connection.dbReconnect = async () => {
    console.log("DB connection status" + mongoose.connection.readyState )
    if ( mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3 ) {
        try {
            await connection.dbConnect()
        }
        catch ( error ) {
            throw error
        }
    }
}

connection.dbConnect = async () => {
    try {
        await mongoose.connect(dbURL)
    }
    catch (error) {
        let err = new Error ("Failed to connect DB " + error )
        err.status = 500
        throw err
    }
    
}

module.exports = connection