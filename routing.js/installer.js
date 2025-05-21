const express = require('express');
const router = express.Router()
const constants = require('../utilities/constants');
const registration = require('../Controller/registerUser');
const login = require('../Controller/login');
const getUserDetails = require('../Controller/getUserDetails');
const updateUserInfo = require('../Controller/updateUserInfo');
const deleteuserInfo = require('../Controller/deleteUserInfo');
const sendMailToResetPassword = require('../Controller/sendEmailToResetPassord');
const resetPassword = require('../Controller/resetPassword');


let user = constants.USER_INSTALLER

// Route to register an Installer
router.post( constants.REGISTER, registration);

// Route for installer login
router.post( constants.LOGIN, login)

// Route to get installer details
router.get( constants.GET_USER, getUserDetails);

// Route to update installer details
router.put( constants.UPDATE_USER, updateUserInfo)

//Route to delete installer account 
router.delete(constants.DELETE_ACCOUNT, deleteuserInfo)

// Route to send email for password reset
router.post(constants.SEND_MAIL_TO_RESET_PASSWORD, sendMailToResetPassword)

// Route to reset password
router.put(constants.RESET_PASSWORD, resetPassword)

module.exports = router