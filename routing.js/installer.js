const express = require('express');
const router = express.Router()
const registration = require('../Controller/registerAccount');
const login = require('../Controller/login');
const constants = require('../utilities/constants');
const Installer = require('../Models/Installer');
const validator = require('../utilities/validators');



// Route to register an Installer
router.post( constants.REGISTER, async ( req, res, next ) => {
    try {
        let installerObj = new Installer(req.body);

        // Validate the request body
        validator.validateEmail(installerObj.email);
        validator.validatePhoneNumber(installerObj.phoneNumber);
        validator.validatePassword(installerObj.password);
        
        let installerDetails = await registration.registerInstaller(installerObj);
        res.status( constants.HTTP_CREATED).json( { 'message' : constants.REGISTRATION_SUCCESS, 'data' : installerDetails } )
    } catch (error) {
        next(error);
    }
});

// Route for installer login
router.post( constants.LOGIN, async ( req, res, next ) => {
    try {
        // Validate the request body
        validator.validateEmail(req.body.email);
        validator.validatePassword(req.body.password);

        await login.installerLogin(req.body);
        res.status( constants.HTTP_OK).json( { 'message' : constants.LOGIN_SUCCESS } )
    } catch (error) {
        next(error);
    }
});


module.exports = router