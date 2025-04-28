const constants = require('./constants')

let validator = {}

validator.validatePhoneNumber = ( phoneNumber ) => {
    let phoneNumberRegex = /^\d{10}$/
    if ( !phoneNumberRegex.test(phoneNumber) ) {
        let err = new Error(constants.INVALID_PHONE_NUMBER)
        err.error = constants.INVALID_PHONE_NUMBER
        err.status = 400
        throw err
    }
}

validator.validateEmail = ( email ) => {
    let emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if ( !emailRegex.test(email) ) {
        let err = new Error(constants.INVALID_EMAIL)
        err.error = constants.INVALID_EMAIL
        err.status = 400
        throw err
    }
}

validator.validatePassword = ( password ) => {
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if ( !passwordRegex.test(password) ) {
        let err = new Error(constants.INVALID_PASSWORD)
        err.error = constants.INVALID_PASSWORD
        err.status = 400
        throw err
    }
}

module.exports = validator