const constants = require("../utilities/constants");
const nodemailer = require("nodemailer");
const passwordUtil = require("../utilities/passwordUtil");
const customer = require("../Models/customerModel");
const installer = require("../Models/installerModel");
const dbConnection = require("../utilities/dbConnection");
const formatError = require("../utilities/errorFormat");
const validator = require("../utilities/validators");

module.exports = async (req, res, next) => {
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
        next(dbConnect.error);
    } else {
        try {
            await validateInput(req.body);
            
            // Generate a reset password token
            let token = passwordUtil.generateResetToken()

            // Save the token to the database
            await saveTokenToDatabase(req, res, token);

            // Send the reset password email
            await sendResetPasswordEmail(req, token.resetToken);

            res.status(constants.HTTP_OK).json({ message: constants.RESET_PASSWORD_EMAIL_SENT});
        } catch (error) {
            if (error.message === constants.RESET_PASSWORD_EMAIL_FAILED) {
                next(error);
            }
            else {
                let err = formatError(constants.RESET_PASSWORD_EMAIL_FAILED, error.message);
                next(err);
            }
        }
    }
}

async function validateInput ( userObj ) {
    if (!userObj.email) {
        let err = formatError(constants.RESET_PASSWORD_EMAIL_FAILED, constants.MANDATORY_FIELDS_MISSING, constants.HTTP_BAD_REQUEST)
        throw err;
    }
    if (!validator.validateEmail(userObj.email)) {
        let err = formatError(constants.RESET_PASSWORD_EMAIL_FAILED, constants.INVALID_EMAIL, constants.HTTP_BAD_REQUEST)
        throw err
    }
}

async function saveTokenToDatabase(req, res, token) {
    try {
        let userDetails;
        if (req.body.role === constants.USER_CUSTOMER) {
            userDetails = await customer.findOne({ email: req.body.email }); // Fix query syntax
        } else {
            userDetails = await installer.findOne({ email: req.body.email }); // Fix query syntax
        }
        if (!userDetails) {
            let err = formatError(constants.RESET_PASSWORD_EMAIL_FAILED, constants.USER_NOT_FOUND, constants.HTTP_BAD_REQUEST);
            throw err;
        }
        userDetails.resetPasswordToken = token.resetPasswordToken;
        userDetails.resetPasswordExpires = token.resetTokenExpiry;
        await userDetails.save({ validateBeforeSave: false });
    } catch (error) {
        throw error;
    }   
}

async function sendResetPasswordEmail(req, resetToken) {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASSWORD
            },
        });

        let resetURL = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;

        let message = `
          <p>You are receiving this because you (or someone else) has requested the reset of the password for your account.</p>
          <p>Please click on the following link, or paste this into your browser to complete the process:</p>
          <p><a href="${resetURL}">${resetURL}</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `;
        let mailOptions = {
            to: req.body.email,
            from: process.env.MAIL_ID,
            subject: 'Password Reset Request',
            html: message,
        } 
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } 
    catch (error) {
        console.error('Error sending email:', error);
        throw error
    }
}

