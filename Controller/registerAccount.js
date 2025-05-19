const dbConnection = require('../utilities/dbConnection');
const customer = require('../Models/customerModel');
const installer = require('../Models/installerModel');
const constants = require('../utilities/constants');
const formatError = require('../utilities/errorFormat');
const passwordUtil = require('../utilities/passwordUtil');

let registration = {}

registration.registerCustomer = async (customerObj) => {
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
        throw dbConnect.error;
    } else {
        try {
            // Check if the email already exists in the database
            let existingCustomer = await customer.findOne({ email: customerObj.email });
            if (existingCustomer) {
                let err = formatError(constants.EMAIL_ALREADY_REGISTERED, constants.EMAIL_ALREADY_REGISTERED, constants.HTTP_BAD_REQUEST)
                throw err; 
            }
            let newCustomer = new customer(customerObj);
            let customerDetails = await newCustomer.save();
            return customerDetails;
        } catch (error) {
            // Check if the error is an expected one and rethrow it
            if (error.error === constants.EMAIL_ALREADY_REGISTERED) {
                throw error;
            }
            // Handle unexpected errors
            let err = formatError(constants.REGISTRATION_FAILURE, error.message)
            throw err;
        }
    }
};

registration.registerInstaller = async (installerObj) => {
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
        throw dbConnect.error;
    } else {
        try {
            // Check if the email already exists in the database
            let existingInstaller = await installer.findOne({ email: installerObj.email });
            if (existingInstaller) {
                let err = formatError(constants.EMAIL_ALREADY_REGISTERED, constants.EMAIL_ALREADY_REGISTERED, constants.HTTP_BAD_REQUEST)
                throw err; 
            }

            // Encrypt the password before saving
            let encryptedPassword = await passwordUtil.encryptPassword(installerObj.password);
            installerObj.password = encryptedPassword;

            let newInstaller = new installer(installerObj);
            let installerDetails = await newInstaller.save();
            return installerDetails;
        } catch (error) {
            // Check if the error is an expected one and rethrow it
            if (error.error === constants.EMAIL_ALREADY_REGISTERED) {
                throw error;
            }
            // Handle unexpected errors
            let err = formatError(constants.REGISTRATION_FAILURE, error.message)
            throw err;
        }
    }
};
    




module.exports = registration