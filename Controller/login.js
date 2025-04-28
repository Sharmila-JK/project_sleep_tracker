const installer = require('../Models/installerModel');
const customer = require('../Models/customerModel');
const constants = require('../utilities/constants');
const dbConnection = require('../utilities/dbConnection');

let login = {}

// Function to handle installer login
login.installerLogin = async (req) => {
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
        throw dbConnect.error;
    } else {
        try {
            let installerDetails = await installer.findOne({ email: req.email });
            // Check if the user exists in the database
            if (!installerDetails) {
                let err = new Error(constants.LOGIN_FAILURE);
                err.error = constants.USER_NOT_FOUND;
                err.status = constants.HTTP_UNAUTHORIZED
                throw err;
            }
            // Compare the password with the password in the database
            if (req.password !== installerDetails.password) {
                let err = new Error(constants.LOGIN_FAILURE);
                err.error = constants.INVALID_PASSWORD;
                err.status = constants.HTTP_UNAUTHORIZED
                throw err;
            }
        }
        catch ( error ) {
            // Check if the error is an expected one and rethrow it
            if (error.error === constants.USER_NOT_FOUND || error.error === constants.INVALID_PASSWORD) {
                throw error;
            }
            // Handle unexpected errors
            let err = new Error(constants.LOGIN_FAILURE);
            err.error = error.message;
            throw err;

        }
    }
}

// Function to handle customer login
login.customerLogin = async (req) => {
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
        throw dbConnect.error;
    } else {
        try {
            let customerDetails = await customer.findOne({ email: req.email });
            // Check if the user exists in the database
            if (!customerDetails) {
                let err = new Error(constants.LOGIN_FAILURE);
                err.error = constants.USER_NOT_FOUND;
                err.status = constants.HTTP_UNAUTHORIZED
                throw err;
            }
            // Compare the password with the password in the database
            if (req.password !== customerDetails.password) {
                let err = new Error(constants.LOGIN_FAILURE);
                err.error = constants.INVALID_PASSWORD;
                err.status = constants.HTTP_UNAUTHORIZED
                throw err;
            }
        }
        catch ( error ) {
            // Check if the error is an expected one and rethrow it
            if (error.error === constants.USER_NOT_FOUND || error.error === constants.INVALID_PASSWORD) {
                throw error;
            }
            // Handle unexpected errors
            let err = new Error(constants.LOGIN_FAILURE);
            err.error = error.message;
            throw err;

        }
    }
}



module.exports = login