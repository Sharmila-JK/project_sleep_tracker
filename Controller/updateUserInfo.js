const installer = require('../Models/installerModel');
const customer = require('../Models/customerModel');
const constants = require('../utilities/constants');
const dbConnection = require('../utilities/dbConnection');
const formatError = require('../utilities/errorFormat');
const Customer = require('../Models/customer');
const Installer = require('../Models/installer');
const validator = require('../utilities/validators');

module.exports = async ( req, res, next) => {
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
        next(dbConnect.error)
    } else {
        try {
            let role = req.body.role;
            let userObj;
            if ( role === constants.USER_CUSTOMER  ) {
                userObj = new Customer(req.body)
            }
            else {
                userObj = new Installer(req.body)
            }

            // Validate the input data
            await validateInput(userObj);

            let updatedUserDetails = await updateUser(role, req.params.userId, userObj);
            res.status( constants.HTTP_OK).json( { 'message' : constants.UPDATE_SUCCESS, 'data' : updatedUserDetails } )
        }
        catch ( error ) {
            // Check if the error is an expected one
            if (error.message === constants.UPDATE_FAILED) {
                next(error)
            }
            // Handle unexpected errors
            let err = formatError(constants.UPDATE_FAILED, error.message) 
            next(err)
        }
    }
}

async function validateInput ( userObj ) {
    if ( userObj.email) {
        if (!validator.validateEmail(userObj.email)) {
            let err = formatError(constants.UPDATE_FAILED, constants.INVALID_EMAIL, constants.HTTP_BAD_REQUEST)
            throw err; 
        }
    }
    if ( userObj.phoneNumber ) {
        if(!validator.validatePhoneNumber(userObj.phoneNumber)) {
            let err = formatError(constants.UPDATE_FAILED, constants.INVALID_PHONE_NUMBER, constants.HTTP_BAD_REQUEST)
            throw err; 
        }
    }
}

async function updateUser(role, userId, data) {
    let updatedUserDetails;
    if ( role === constants.USER_CUSTOMER ) {
        updatedUserDetails = await customer.findByIdAndUpdate(userId, data, { new: true });
    }
    else {
        updatedUserDetails = await installer.findByIdAndUpdate(userId, data, { new: true })
    }

    if (!updatedUserDetails) {
        let err = formatError(constants.UPDATE_FAILED, constants.USER_NOT_FOUND, constants.HTTP_NOT_FOUND)
        throw err;
    }
    return updatedUserDetails;
}
