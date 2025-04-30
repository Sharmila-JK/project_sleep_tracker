const installer = require('../Models/installerModel');
const customer = require('../Models/customerModel');
const constants = require('../utilities/constants');
const dbConnection = require('../utilities/dbConnection');

let login = {}

// Function to handle users login
login.userLogin = async (req, user) => {
    let userDetails
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
        throw dbConnect.error;
    } else {
        try {
            if ( user === constants.USER_INSTALLER ) {
               userDetails = await installer.findOne({ email: req.email });
            }
            else {
                userDetails = await customer.findOne({ email: req.email });
            }
            // Check if the user exists in the database
            if (!userDetails) {
                let err = new Error(constants.LOGIN_FAILURE);
                err.error = constants.USER_NOT_FOUND;
                err.status = constants.HTTP_UNAUTHORIZED
                throw err;
            }
            // Compare the password with the password in the database
            if (req.password !== userDetails.password) {
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

// Function to get user details
login.getUserDetails = async ( id, user) => {
    let userDetails
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
        throw dbConnect.error;
    } else {
        try {
            if ( user === constants.USER_INSTALLER ) {
               userDetails = await installer.findOne({ _id : id});
            }
            else {
                userDetails = await customer.findOne({ _id : id });
            }
            // Check if the user exists in the database
            if (!userDetails) {
                let err = new Error(constants.SEARCH_FAILED);
                err.error = constants.USER_NOT_FOUND;
                err.status = constants.HTTP_NOT_FOUND
                throw err;
            }
            return userDetails;
        }
        catch ( error ) {
            // Check if the error is an expected one and rethrow it
            if (error.error === constants.USER_NOT_FOUND) {
                throw error;
            }
            // Handle unexpected errors
            let err = new Error(constants.SEARCH_FAILED);
            err.error = error.message;
            throw err;
        }
    }
}

module.exports = login