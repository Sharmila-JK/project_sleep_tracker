module.exports = Object.freeze ( {
    
// Http Status Codes
HTTP_OK : 200,
HTTP_CREATED : 201,
HTTP_BAD_REQUEST : 400,
HTTP_SERVER_ERROR : 500,
HTTP_UNAUTHORIZED : 401,
HTTP_FORBIDDEN : 403,
HTTP_NOT_FOUND : 404,
ERROR_LOGGER : "Logs/ErrorLogger_",
REQUEST_LOGGER : "Logs/RequestLogger_",

USER_INSTALLER : 'Installer',
USER_CUSTOMER : 'Customer',

// Routes
CUSTOMER : "/customer",
INSTALLER : "/installer",
LOGIN : "/login",
REGISTER : "/register",
GET_USER : "/getUser/:userId",
UPDATE_USER : "/updateUser/:userId",
DELETE_ACCOUNT : "/deleteAccount/:userId",

// Response Messages
REGISTRATION_SUCCESS : "Registration Successful",
REGISTRATION_FAILURE : "Registration Failed",
INTERNAL_SERVER_ERR : "Internal Server Error",
LOG_ERR : "Failed to log the errors",
DB_ERR : "Failed to connect the DB",
EMAIL_ALREADY_REGISTERED : "Email already registered",
INVALID_EMAIL : "Invalid Email",
INVALID_PHONE_NUMBER : "Invalid Phone Number",
INVALID_PASSWORD : "Invalid Password",
LOGIN_SUCCESS : "Login Successful",
LOGIN_FAILURE : "Login Failed",
USER_NOT_FOUND : "User not found",
USER_DETAILS_SUCCESS : "User details fetched successfully",
SEARCH_FAILED : "Search failed",
UPDATE_SUCCESS : "Update successful",
UPDATE_FAILED : "Update failed",
MISSING_FIELDS : "Email/Password is missing",
DELETE_ACCOUNT_SUCCESS : "Account deleted successfully",
DELETE_ACCOUNT_FAILURE : "Account deletion failed",



})