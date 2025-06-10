const installer = require('../Models/installerModel');
const customer = require('../Models/customerModel');
const constants = require('../utilities/constants');
const dbConnection = require('../utilities/dbConnection');
const formatError = require('../utilities/errorFormat');
const passwordUtil = require('../utilities/passwordUtil');
const validator = require('../utilities/validators');
const jwtUtil = require('../utilities/jwtUtil');


module.exports = async (req, res, next) => {
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
        next(dbConnect.error)
    } else {
        try {
            // Validate the request body
            await validateInput(req);

            // Check if the user exists in the database
            let userDetails = await checkUserExists(req.body.role, req.body.email);

            // Compare the password with the password in the database
            let isPasswordMatch = await passwordUtil.comparePassword(req.body.password, userDetails.password);
            if (!isPasswordMatch) {
                let err = formatError(constants.LOGIN_FAILURE, constants.WRONG_PASSWORD, constants.HTTP_UNAUTHORIZED)
                throw err;
            }

            let updatedUserDetails = await updateUserToken(req, userDetails);

            res.status( constants.HTTP_OK).json( { 'message' : constants.LOGIN_SUCCESS, 'data' : updatedUserDetails } )
        }
        catch ( error ) {
            // Check if the error is an expected one and rethrow it
            if (error.message === constants.LOGIN_FAILURE) {
                next(error)
            } else {
                // Handle unexpected errors
                let err = formatError(constants.LOGIN_FAILURE, error.message)
                next(err)    
            }
        }
    }
}

async function validateInput(req) {
    // Validate the request body
    if ( !req.body.email || !req.body.password ) {
        let err = formatError( constants.LOGIN_FAILURE, constants.MISSING_FIELDS, constants.HTTP_BAD_REQUEST );
        throw err;
    }
    if (!validator.validateEmail(req.body.email)) {
        let err = formatError(constants.LOGIN_FAILURE, constants.INVALID_EMAIL, constants.HTTP_BAD_REQUEST)
        throw err; 
    }
    if(!validator.validatePassword(req.body.password)) {
        let err = formatError(constants.LOGIN_FAILURE, constants.INVALID_PASSWORD, constants.HTTP_BAD_REQUEST)
        throw err; 
    }
}

async function checkUserExists(role, email) {
    let userDetails;
    try {
        if (role === constants.USER_CUSTOMER) {
            userDetails = await customer.findOne({ email: email });
        } else {
            userDetails = await installer.findOne({ email: email });
        }
        if (!userDetails) {
            let err = formatError(constants.LOGIN_FAILURE, constants.USER_NOT_FOUND, constants.HTTP_UNAUTHORIZED);
            throw err;
        }
        return userDetails;
    } catch (error) {
        throw error;
    }
}

async function updateUserToken(req, userDetails) {
    try {
        let updatedUserDetails;
        let tokenPayload = {
            userId: userDetails._id,
            email: userDetails.email,
            role: req.body.role ? req.body.role : constants.USER_INSTALLER
        }
        let token = jwtUtil.generateAccessToken(tokenPayload)

        // Update the user document with the new token
        if (req.body.role === constants.USER_CUSTOMER) {
            updatedUserDetails = await customer.findOneAndUpdate({ _id: userDetails._id }, { $set: { accessToken: token } }, { new: true, runValidators: true });
        } else {
            updatedUserDetails = await installer.findOneAndUpdate({ _id: userDetails._id }, { $set: { accessToken: token } }, { new: true, runValidators: true });
        }
        return updatedUserDetails
    } catch (error) {
        throw error
    }
}
