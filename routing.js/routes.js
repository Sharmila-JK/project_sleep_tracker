const express = require('express');
const router = express.Router();
const constants = require('../utilities/constants');
const registration = require('../Controller/registerUser');
const login = require('../Controller/login');
const getUserDetails = require('../Controller/getUserDetails');
const updateUserInfo = require('../Controller/updateUserInfo');
const deleteUserInfo = require('../Controller/deleteUserInfo');
const sendMailToResetPassword = require('../Controller/sendEmailToResetPassord');
const resetPassword = require('../Controller/resetPassword');

// Route to register a customer
router.post( constants.REGISTER, registration)

// Route for customer login
router.post( constants.LOGIN, login)

// Route to get customer details
router.get( constants.GET_USER, getUserDetails)

// Route to update customer details
router.put( constants.UPDATE_USER, updateUserInfo)

// Route to delete customer account
router.delete(constants.DELETE_ACCOUNT, deleteUserInfo)

// Route to send email for password reset
router.post(constants.SEND_MAIL_TO_RESET_PASSWORD, sendMailToResetPassword)

// Route to reset password
router.put(constants.RESET_PASSWORD, resetPassword)

module.exports = router