const installer = require('../Models/installerModel');
const customer = require('../Models/customerModel');
const constants = require('../utilities/constants');
const dbConnection = require('../utilities/dbConnection');

let update = {}

update.updateUserDetails = async ( userId, data, user) => {
    let updatedUserDetails
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
        throw dbConnect.error;
    } else {
        try {
            if ( user === constants.USER_INSTALLER ) {
                updatedUserDetails = await installer.findByIdAndUpdate(userId, data, { new: true });
            }
            else {
                updatedUserDetails = await customer.findByIdAndUpdate(userId, data, { new: true })
            }

            if (!updatedUserDetails) {
                let err = new Error(constants.UPDATE_FAILED);
                err.error = constants.USER_NOT_FOUND;
                err.status = constants.HTTP_NOT_FOUND
                throw err;
            }
            return updatedUserDetails;
        }
        catch ( error ) {
            // Check if the error is an expected one and rethrow it
            if (error.error === constants.USER_NOT_FOUND) {
                throw error;
            }
            // Handle unexpected errors
            let err = new Error(constants.UPDATE_FAILED);
            err.error = error.message;
            throw err;
        }
    }
}

update.deleteAccount = async ( userId, user ) => {
    let deletedUserDetails
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
        throw dbConnect.error;
    } else {
        try {
            if ( user === constants.USER_INSTALLER ) {
                deletedUserDetails = await installer.findByIdAndDelete(userId);
            }
            else {
                deletedUserDetails = await customer.findByIdAndDelete(userId)
            }

            if (!deletedUserDetails) {
                let err = new Error(constants.DELETE_ACCOUNT_FAILURE);
                err.error = constants.USER_NOT_FOUND;
                err.status = constants.HTTP_NOT_FOUND
                throw err;
            }
            return deletedUserDetails;
        }
        catch ( error ) {
            // Check if the error is an expected one and rethrow it
            if (error.error === constants.USER_NOT_FOUND) {
                throw error;
            }
            // Handle unexpected errors
            let err = new Error(constants.DELETE_ACCOUNT_FAILURE);
            err.error = error.message;
            throw err;
        }
    }


}

module.exports = update