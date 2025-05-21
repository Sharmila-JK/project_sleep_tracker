
const installer = require('../Models/installerModel');
const customer = require('../Models/customerModel');
const constants = require('../utilities/constants');
const dbConnection = require('../utilities/dbConnection');
const formatError = require('../utilities/errorFormat');


module.exports = async ( req, res, next) => {
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
       next(dbConnect.error)
    } else {
        try {
            let userDetails
            if ( req.body.user === constants.USER_CUSTOMER ) {
               userDetails = await customer.findOne({ _id : req.params.userId});
            }
            else {
                userDetails = await installer.findOne({ _id : req.params.userId });
            }
            // Check if the user exists in the database
            if (!userDetails) {
                let err = formatError( constants.SEARCH_FAILED, constants.USER_NOT_FOUND, constants.HTTP_NOT_FOUND)
                throw err;
            }
            res.status( constants.HTTP_OK).json( { 'message' : constants.USER_DETAILS_SUCCESS, 'data' : userDetails } )
        }
        catch ( error ) {
            // Check if the error is an expected one and rethrow it
            if (error.error === constants.SEARCH_FAILED) {
                next(error)
            }
            // Handle unexpected errors
            let err = formatError(constants.SEARCH_FAILED, error.message)
            next(err)
        }
    }
}
      