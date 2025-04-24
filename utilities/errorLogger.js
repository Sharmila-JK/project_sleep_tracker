const fs = require('fs/promises')
const constants = require('./constants')

let errorLogger = async (err, req, res, next) => {
    let loggerDate = new Date().toDateString()
    let filePath = constants.ERROR_LOGGER + loggerDate + '.txt'
    let errMessage = err.stack ? err.stack : err.toString()
    let statusCode = err.status || 500;
    
    try {
        await fs.appendFile(filePath, errMessage)
    }
    catch( err ) {
        console.log("Failed to log the errors", err )
    }
    res.status(statusCode).json({ message: err.message || 'Internal Server Error' });
    
}

module.exports = errorLogger