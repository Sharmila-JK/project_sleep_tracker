const express = require('express');
const router = express.Router();
const registration = require('../Controller/registerAccount');
const Customer = require('../Models/customer');
const constants = require('../utilities/constants');
const validator = require('../utilities/validators');



// Route to register a customer
router.post( constants.REGISTER_CUSTOMER, async ( req, res, next ) => {
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


module.exports = router