const installer = require('../Models/installerModel');
const customer = require('../Models/customerModel');
const constants = require('../utilities/constants');
const dbConnection = require('../utilities/dbConnection');
const formatError = require('../utilities/errorFormat');
const Customer = require('../Models/customer');
const Installer = require('../Models/installer');
const validator = require('../utilities/validators');
const jwtUtil = require('../utilities/jwtUtil');

module.exports = async ( req, res, next) => {
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
        next(dbConnect.error)
    } else {
        try {
            let role = req.body.role ? req.body.role : constants.USER_INSTALLER;
            let token = req.headers.accesstoken
            let userObj;
            if ( role === constants.USER_CUSTOMER  ) {
                userObj = new Customer(req.body)
            }
            else {
                userObj = new Installer(req.body)
            }

            // Check if the user is valid
            await checkValidUser(role, token, req.params.userId);

            // Validate the input data
            await validateInput(userObj);

            // Check if the email already exists
            if (userObj.email) {
                await checkEmailExists(role, userObj.email);
            }

            let updatedUserDetails = await updateUser(role, req.params.userId, userObj);
            res.status( constants.HTTP_OK).json( { 'message' : constants.UPDATE_SUCCESS, 'data' : updatedUserDetails } )
        }
        catch ( error ) {
            // Check if the error is an expected one
            if (error.message === constants.UPDATE_FAILED) {
                next(error)
            }
            else {
                // Handle unexpected errors
                let err = formatError(constants.UPDATE_FAILED, error.message) 
                next(err)
            }
        }
    }
}

async function checkValidUser( role, token, userId ) {
    try {
        let decodedToken = jwtUtil.verifyAccessToken(token);
        if (decodedToken.role !== role) {
            let err = formatError(constants.UPDATE_FAILED, constants.INVALID_ACCESS, constants.HTTP_UNAUTHORIZED);
            throw err;
        }
        if ( decodedToken.userId !== userId ) {
            let err = formatError(constants.UPDATE_FAILED, constants.INVALID_ACCESS, constants.HTTP_UNAUTHORIZED);
            throw err;
        }
    } catch (error) {
        if ( error.message === constants.UPDATE_FAILED){
            throw error
        }
        else {
            console.log(error)
            let err = formatError(constants.UPDATE_FAILED, constants.INVALID_ACCESS_TOKEN, constants.HTTP_UNAUTHORIZED);
            throw err;
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

async function checkEmailExists ( role,  email ) {
    try {
        let existingUser
        if ( role === constants.USER_CUSTOMER ) {
            existingUser = await customer.findOne({ email: email })
        }
        else {
            existingUser = await installer.findOne({ email: email })
        }
        if (existingUser) {
            let err = formatError(constants.UPDATE_FAILED, constants.EMAIL_EXISTS, constants.HTTP_BAD_REQUEST)
            throw err; 
        }
    }
    catch (error) {
        throw error
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
}
  