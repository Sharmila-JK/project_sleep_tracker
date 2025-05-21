const installer = require('../Models/installerModel');
const customer = require('../Models/customerModel');
const constants = require('../utilities/constants');
const formatError = require('../utilities/errorFormat');
const dbConnection = require('../utilities/dbConnection');
const passwordUtil = require('../utilities/passwordUtil');
const validator = require('../utilities/validators');

module.exports = async (req, res, next) => {
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
        next(dbConnect.error);
    } else {
        try {
            // Validate the input
            await validateInput(req.body);

            // Check if the token is valid and not expired
            let userDetails = await checkTokenInDatabase(req.body.role, req.params.resetToken);

            // Update the password in the database
            await updatePassword ( userDetails, req.body.password )

            res.status(constants.HTTP_OK).json({ message: constants.RESET_PASSWORD_SUCCESS });
        } catch (error) {
            // Handle specific error messages
            if (error.message === constants.RESET_PASSWORD_FAILED) {
                next(error)
            } else {
                let err = formatError(constants.RESET_PASSWORD_FAILED, error.message);
                next(err)
            }
            
        }
    }
}

async function validateInput ( userObj ) {
    if (!userObj.password || !userObj.confirmPassword) {
        let err = formatError(constants.RESET_PASSWORD_FAILED, constants.MANDATORY_FIELDS_MISSING, constants.HTTP_BAD_REQUEST)
        throw err;
    }
    if(!validator.validatePassword(userObj.password) || !validator.validatePassword(userObj.confirmPassword)) {
        let err = formatError(constants.RESET_PASSWORD_FAILED, constants.INVALID_PASSWORD, constants.HTTP_BAD_REQUEST)
        throw err; 
    }
    if (userObj.password !== userObj.confirmPassword) {
        let err = formatError(constants.RESET_PASSWORD_FAILED, constants.PASSWORD_MISMATCH, constants.HTTP_BAD_REQUEST)
        throw err;
    }
}

async function checkTokenInDatabase(role, token) {
    try {
        let userDetails;
        let hashedToken = passwordUtil.hashToken(token);
        if (role === constants.USER_CUSTOMER) {
            userDetails = await customer.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now()} })
        }
        else {
            userDetails = await installer.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now()} })
        }
        if (!userDetails) {
            let err = formatError(constants.RESET_PASSWORD_FAILED, constants.INVALID_TOKEN, constants.HTTP_UNAUTHORIZED);
            throw err;
        }
        return userDetails
    } catch (error) {
        throw error
    }
}

async function updatePassword ( userDetails, password ) {
    try {
        let hashedPassword = await passwordUtil.encryptPassword(password);
        userDetails.password = hashedPassword;
        userDetails.resetPasswordToken = undefined;
        userDetails.resetPasswordExpires = undefined;
        await userDetails.save({ validateBeforeSave: false });
    } catch (error) {
        throw error
    }
}