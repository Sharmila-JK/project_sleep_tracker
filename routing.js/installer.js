const express = require('express');
const router = express.Router()
const registration = require('../Controller/registerAccount');
const constants = require('../utilities/constants');
const Installer = require('../Models/Installer');
const validator = require('../utilities/validators');



// Route to register an Installer
router.post( constants.REGISTER_INSTALLER, async ( req, res, next ) => {
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


module.exports = router