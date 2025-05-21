
let validator = {}

validator.validatePhoneNumber = ( phoneNumber ) => {
    let phoneNumberRegex = /^\d{10}$/
    return phoneNumberRegex.test(phoneNumber)
}

validator.validateEmail = ( email ) => {
    let emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email)
}

validator.validatePassword = ( password ) => {
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    return passwordRegex.test(password)
}

module.exports = validator