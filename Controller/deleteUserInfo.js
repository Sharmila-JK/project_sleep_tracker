const installer = require('../Models/installerModel');
const customer = require('../Models/customerModel');
const constants = require('../utilities/constants');
const dbConnection = require('../utilities/dbConnection');
const formatError = require('../utilities/errorFormat');
const jwtUtil = require('../utilities/jwtUtil');

module.exports = async ( req, res, next ) => {
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
        next(dbConnect.error)
    } else {
        try {
            let deletedUserDetails
            let role = req.body && req.body.role ? req.body.role : constants.USER_INSTALLER

            // check if the user is valid
            await checkValidUser(role, req.headers.accesstoken, req.params.userId);

            if ( role === constants.USER_CUSTOMER ) {
                deletedUserDetails = await customer.findByIdAndDelete(req.params.userId);
            }
            else {
                deletedUserDetails = await installer.findByIdAndDelete(req.params.userId)
            }

            if (!deletedUserDetails) {
                let err = formatError(constants.DELETE_ACCOUNT_FAILURE, constants.USER_NOT_FOUND, constants.HTTP_NOT_FOUND)
                throw err;
            }
            res.status( constants.HTTP_OK).json( { 'message' : constants.DELETE_ACCOUNT_SUCCESS, 'data' : deletedUserDetails } )
        }
        catch ( error ) {
            // Check if the error is an expected one
            if (error.message === constants.DELETE_ACCOUNT_FAILURE) {
                next(error)
            }
            else {
                // Handle unexpected errors
                let err = formatError(constants.DELETE_ACCOUNT_FAILURE, error.message)
                next(err)
            }
           
        }
    }
}

async function checkValidUser( role, token, userId ) {
    try {
        let decodedToken = jwtUtil.verifyAccessToken(token);
        if (decodedToken.role !== role) {
            let err = formatError(constants.DELETE_ACCOUNT_FAILURE, constants.INVALID_ACCESS, constants.HTTP_UNAUTHORIZED);
            throw err;
        }
        if ( decodedToken.userId !== userId ) {
            let err = formatError(constants.DELETE_ACCOUNT_FAILURE, constants.INVALID_ACCESS, constants.HTTP_UNAUTHORIZED);
            throw err;
        }
    } catch (error) {
        if ( error.message === constants.DELETE_ACCOUNT_FAILURE){
            throw error
        }
        else {
            console.log( error )
            let err = formatError(constants.DELETE_ACCOUNT_FAILURE, constants.INVALID_ACCESS_TOKEN, constants.HTTP_UNAUTHORIZED);
            throw err;
        }
    }
}
 