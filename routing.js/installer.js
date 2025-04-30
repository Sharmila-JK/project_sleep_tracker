const express = require('express');
const router = express.Router()
const registration = require('../Controller/registerAccount');
const login = require('../Controller/login');
const constants = require('../utilities/constants');
const Installer = require('../Models/Installer');
const validator = require('../utilities/validators');
const updation = require('../Controller/updateDetails');

let user = constants.USER_INSTALLER

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
        if ( !req.body.email || !req.body.password ) {
            let err = new Error(constants.LOGIN_FAILURE);
            err.error = constants.MISSING_FIELDS;   
            err.status = constants.HTTP_BAD_REQUEST
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

// Route to get installer details
router.get( constants.GET_USER, async ( req, res, next ) => {
    try {
        let installerDetails = await login.getUserDetails(req.params.userId, user);
        res.status( constants.HTTP_OK).json( { 'message' : constants.USER_DETAILS_SUCCESS, 'data' : installerDetails } )
    } catch (error) {
        next(error);
    }
});

// Route to update installer details
router.put( constants.UPDATE_USER, async ( req, res, next )  => {
    let installerObj = new Installer(req.body);
    try {
        
      // Validate the request body
      installerObj.email ? validator.validateEmail(installerObj.email) : null
      installerObj.phoneNumber ? validator.validatePhoneNumber(installerObj.phoneNumber) : null
      installerObj.password ? validator.validatePassword(installerObj.password) : null

        let installerDetails = await updation.updateUserDetails(req.params.userId, installerObj, user);
        res.status( constants.HTTP_OK).json( { 'message' : constants.UPDATE_SUCCESS, 'data' : installerDetails } )
    } catch (error) {
        next(error);
    }
} )

//Route to delete installer account 
router.delete(constants.DELETE_ACCOUNT, async ( req, res, next ) => {
    try {
        let deletedAccount = await updation.deleteAccount(req.params.userId, user);
        res.status( constants.HTTP_OK).json( { 'message' : constants.DELETE_ACCOUNT_SUCCESS, 'data' : deletedAccount } )
    } catch (error) {
        next(error);
    }
})

module.exports = router