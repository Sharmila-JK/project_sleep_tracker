const constants = require('./constants')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

let passwordUtil = {}

passwordUtil.encryptPassword = async ( password ) => {
    let salt = null
    try {
        salt = await bcrypt.genSalt(10)
    }catch(err) {
        throw err
    }

    try {
        let hash = await bcrypt.hash(password, salt)
        return hash
    } catch (err) {
        throw err
    }
}

passwordUtil.comparePassword = async ( reqPassword, dbPassword ) => {
    return bcrypt.compare(reqPassword, dbPassword)
}

passwordUtil.generateResetToken = () => {
    let resetToken = crypto.randomBytes(32).toString('hex')
    let resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    let resetTokenExpiry = Date.now() + 30 * 60 * 1000 // 30 minutes
    return { resetToken, resetPasswordToken, resetTokenExpiry }
}

passwordUtil.hashToken = ( token ) => {
    return crypto.createHash('sha256').update(token).digest('hex')
}

module.exports = passwordUtil