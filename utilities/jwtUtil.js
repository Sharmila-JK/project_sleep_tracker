const jwt = require('jsonwebtoken')

let jwtUtil = {}

jwtUtil.generateAccessToken= (payload) => {
    // Generate a JWT token with the payload and a secret key
    return jwt.sign(payload, process.env.JWT_SECRET);
}

jwtUtil.verifyAccessToken = (token) => {
    // Verify the JWT token using the secret key
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw error
    }
}

module.exports = jwtUtil