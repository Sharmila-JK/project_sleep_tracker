module.exports = Object.freeze ( {
    
// Http Status Codes
HTTP_OK : 200,
HTTP_CREATED : 201,
HTTP_BAD_REQUEST : 400,
HTTP_SERVER_ERROR : 500,
ERROR_LOGGER : "ErrorLogger_",
REQUEST_LOGGER : "RequestLogger_",


// Routes
CUSTOMER : "/customer",
INSTALLER : "/installer",
LOGIN : "/login",
REGISTER_CUSTOMER : "/registerCustomer",
REGISTER_INSTALLER : "/registerInstaller",

// Response Messages
REGISTRATION_SUCCESS : "Registration Successful",
REGISTRATION_FAILURE : "Registration Failed",
INTERNAL_SERVER_ERR : "Internal Server Error",
LOG_ERR : "Failed to log the errors",
DB_ERR : "Failed to connect the DB",
EMAIL_ALREADY_REGISTERED : "Email already registered",
INVALID_EMAIL : "Invalid Email",
INVALID_PHONE_NUMBER : "Invalid Phone Number",
INVALID_PASSWORD : "Invalid Password"


})