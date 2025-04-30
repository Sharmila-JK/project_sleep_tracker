const constants = require("./constants");

function formatError (message = constants.INTERNAL_SERVER_ERR, errorDetails, status = 500) {
    let err = new Error(message)
    err.error = errorDetails;
    err.status = status;
    return err;
}

module.exports = formatError