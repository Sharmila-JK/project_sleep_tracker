const dbConnection = require('../utilities/dbConnection');
const customer = require('../Models/customerModel');
const installer = require('../Models/installerModel');
const constants = require('../utilities/constants');
const formatError = require('../utilities/errorFormat');
const passwordUtil = require('../utilities/passwordUtil');
const Customer = require('../Models/customer');
const Installer = require('../Models/installer');
const validator = require('../utilities/validators');

module.exports = async (req, res, next) => {
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
            
            // Check if the email already exists in the database
            await checkEmailExists(role, userObj.email)
    
            let userDetails = await saveUser(role, userObj);
            res.status( constants.HTTP_CREATED).json( { 'message' : constants.REGISTRATION_SUCCESS, 'data' : userDetails } )
        } catch (error) {
            // Check if the error is an expected one
            if (error.message === constants.REGISTRATION_FAILURE) {
                next(error)
            }
            else {
                // Handle unexpected errors
                let err = formatError(constants.REGISTRATION_FAILURE, error.message)
                next(err)
            }
        }
    }  
}

async function validateInput ( userObj ) {
    if (!userObj.email || !userObj.password || !userObj.name) {
        let err = formatError(constants.REGISTRATION_FAILURE, constants.MANDATORY_FIELDS_MISSING, constants.HTTP_BAD_REQUEST)
        throw err;
    }
    if (!validator.validateEmail(userObj.email)) {
        let err = formatError(constants.REGISTRATION_FAILURE, constants.INVALID_EMAIL, constants.HTTP_BAD_REQUEST)
        throw err; 
    }
    if(!validator.validatePassword(userObj.password)) {
        let err = formatError(constants.REGISTRATION_FAILURE, constants.INVALID_PASSWORD, constants.HTTP_BAD_REQUEST)
        throw err; 
    }
    if ( userObj.phoneNumber ) {
        if(!validator.validatePhoneNumber(userObj.phoneNumber)) {
            let err = formatError(constants.REGISTRATION_FAILURE, constants.INVALID_PHONE_NUMBER, constants.HTTP_BAD_REQUEST)
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
            let err = formatError(constants.REGISTRATION_FAILURE, constants.EMAIL_ALREADY_REGISTERED, constants.HTTP_BAD_REQUEST)
            throw err; 
        }
    }
    catch (error) {
        throw error
    }   
} 

async function saveUser( role, userObj ) {
    try {
        let userDetails;
        // Encrypt the password before saving
        let encryptedPassword = await passwordUtil.encryptPassword(userObj.password);
        userObj.password = encryptedPassword

        // Save the user object to the database
        if ( role === constants.USER_CUSTOMER ) {
            let newCustomer = new customer(userObj)
            userDetails = await newCustomer.save();
        }
        else {
            let newInstaller = new installer(userObj)
            userDetails = await newInstaller.save();
        }
        return userDetails;
    } catch (error) {
        throw error
    }
}
 