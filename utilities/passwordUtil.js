const constants = require('./constants')
const bcrypt = require('bcrypt')

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

module.exports = passwordUtil