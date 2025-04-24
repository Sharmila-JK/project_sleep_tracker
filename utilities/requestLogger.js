const {appendFile} = require('fs/promises')
const constants = require('./constants')

let requestLogger = async (req, res, next) => {
    let loggerDate = new Date().toDateString()
    let filePath = constants.REQUEST_LOGGER + loggerDate + '.txt'
    let logMessage = "Request method: " + req.method + "\nRequest url " + req.url + "\n\n"
   
    try {
        await appendFile(filePath, logMessage)
    }
    catch( err ) {
        console.log("Failed to log the request", err)
    }
    next()
}

module.exports = requestLogger