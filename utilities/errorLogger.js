const fs = require('fs/promises')
const constants = require('./constants')

let errorLogger = async (err, req, res, next) => {
    let loggerDate = new Date().toDateString()
    let filePath = constants.ERROR_LOGGER + loggerDate + '.txt'
    let errMessage = err.stack ? err.stack : err.toString()
    let status = err.status ? err.status : constants.HTTP_SERVER_ERROR
    
    try {
        await fs.appendFile(filePath, errMessage + "\n--------------------\n")
    }
    catch( err ) {
        console.log(constants.LOG_ERR, err )
    }
    res.status(status).json({ message: err.message || constants.INTERNAL_SERVER_ERR, error: err.error ? err. error : null });
    
}

module.exports = errorLogger