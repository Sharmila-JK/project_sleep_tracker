const express = require('express');
const router = express.Router();
const registration = require('../Controller/registerAccount');
const Customer = require('../Models/customer');
const constants = require('../utilities/constants');
const validator = require('../utilities/validators');
const login = require('../Controller/login');
const updation = require('../Controller/updateDetails');
const formatError = require('../utilities/errorFormat');

let user = constants.USER_CUSTOMER


// Route to register a customer
router.post( constants.REGISTER, async ( req, res, next ) => {
    try {
        let customerObj = new Customer(req.body);

         // Validate the request body
        validator.validateEmail(customerObj.email);
        validator.validatePhoneNumber(customerObj.phoneNumber);
        validator.validatePassword(customerObj.password);

        let customerDetails = await registration.registerCustomer(customerObj);
        res.status( constants.HTTP_CREATED).json( { 'message' : constants.REGISTRATION_SUCCESS, 'data' : customerDetails } )
    } catch (error) {
        next(error);
    }
});

// Route for customer login
router.post( constants.LOGIN, async ( req, res, next ) => {
    try {
        // Validate the request body
        if ( !req.body.email || !req.body.password ) {
            let err = formatError( constants.LOGIN_FAILURE, constants.MISSING_FIELDS, constants.HTTP_BAD_REQUEST );
            throw err;
        }

        validator.validateEmail(req.body.email);
        validator.validatePassword(req.body.password);

        await login.userLogin(req.body, user);
        res.status( constants.HTTP_OK).json( { 'message' : constants.LOGIN_SUCCESS } )
    } catch (error) {
        next(error);
    }
});

// Route to get customer details
router.get( constants.GET_USER, async ( req, res, next ) => {
    try {
        let customerDetails = await login.getUserDetails(req.params.userId, user);
        res.status( constants.HTTP_OK).json( { 'message' : constants.USER_DETAILS_SUCCESS, 'data' : customerDetails } )
    } catch (error) {
        next(error);
    }
});

// Route to update customer details
router.put( constants.UPDATE_USER, async ( req, res, next )  => {
    let customerObj = new Customer(req.body);
    try {

        // Validate the request body
        customerObj.email ? validator.validateEmail(customerObj.email) : null
        customerObj.phoneNumber ? validator.validatePhoneNumber(customerObj.phoneNumber) : null
        customerObj.password ? validator.validatePassword(customerObj.password) : null
        
        let customerDetails = await updation.updateUserDetails(req.params.userId, customerObj, user);
        res.status( constants.HTTP_OK).json( { 'message' : constants.UPDATE_SUCCESS, 'data' : customerDetails } )
    } catch (error) {
        next(error);
    }

} )

// Route to delete customer account
router.delete(constants.DELETE_ACCOUNT, async ( req, res, next ) => {
    try {
        let deletedAccount = await updation.deleteAccount(req.params.userId, user);
        res.status( constants.HTTP_OK).json( { 'message' : constants.DELETE_ACCOUNT_SUCCESS, 'data' : deletedAccount } )
    } catch (error) {
        next(error);
    }
})

module.exports = router