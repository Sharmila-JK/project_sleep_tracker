const constants = require("../utilities/constants");
const nodemailer = require("nodemailer");
const passwordUtil = require("../utilities/passwordUtil");
const customer = require("../Models/customerModel");
const installer = require("../Models/installerModel");
const dbConnection = require("../utilities/dbConnection");
const formatError = require("../utilities/errorFormat");
const validator = require("../utilities/validators");
const jwtUtil = require("../utilities/jwtUtil");

module.exports = async (req, res, next) => {
    let dbConnect = await dbConnection.dbConnect();
    if (dbConnect && dbConnect.flag === false) {
        next(dbConnect.error);
    } else {
        try {
            let role = req.body.role ? req.body.role : constants.USER_INSTALLER;

            // Check if user is valid
            await checkValidUser(role, req.headers.accesstoken, req.body.email);

            await validateInput(req.body);
            
            // Generate a reset password token
            let token = passwordUtil.generateResetToken()

            // Save the token to the database
            await saveTokenToDatabase(req, token);

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

async function saveTokenToDatabase(req, token) {
    try {
        let userDetails;
        if (req.body.role === constants.USER_CUSTOMER) {
            userDetails = await customer.findOneAndUpdate({ email: req.body.email }, { $set: { resetPasswordToken: token.resetPasswordToken, resetPasswordExpires: token.resetTokenExpiry } }, { new: true, runValidators: true });     
        } else {
            userDetails = await installer.findOneAndUpdate({ email: req.body.email }, { $set: { resetPasswordToken: token.resetPasswordToken, resetPasswordExpires: token.resetTokenExpiry } }, { new: true, runValidators: true }); 
        }
        if (!userDetails) {
            let err = formatError(constants.RESET_PASSWORD_EMAIL_FAILED, constants.USER_NOT_FOUND, constants.HTTP_BAD_REQUEST);
            throw err;
        }
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

async function checkValidUser( role, token, email ) {
    try {
        let decodedToken = jwtUtil.verifyAccessToken(token);
        if (decodedToken.role !== role) {
            let err = formatError(constants.RESET_PASSWORD_EMAIL_FAILED, constants.INVALID_ACCESS, constants.HTTP_UNAUTHORIZED);
            throw err;
        }
        if ( decodedToken.email !== email) {
            let err = formatError(constants.RESET_PASSWORD_EMAIL_FAILED, constants.INVALID_ACCESS, constants.HTTP_UNAUTHORIZED);
            throw err;
        }
    } catch (error) {
        if ( error.message === constants.RESET_PASSWORD_EMAIL_FAILED){
            throw error
        }
        else {
            let err = formatError(constants.RESET_PASSWORD_EMAIL_FAILED, constants.INVALID_ACCESS_TOKEN, constants.HTTP_UNAUTHORIZED);
            throw err;
        }
        
    }
}
