// Module imports
const express = require('express')
const dotenv = require('dotenv')
const errorLogger = require('./utilities/errorLogger')
const requestLogger = require('./utilities/requestLogger')
const customerRouter = require('./routing.js/customer')
const installerRouter = require('./routing.js/installer')
const constants = require('./utilities/constants')


const app = express()
dotenv.config()

let PORT = process.env.PORT || 3000

// Middleware to parse JSON requests
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)
app.use(constants.CUSTOMER, customerRouter)
app.use(constants.INSTALLER, installerRouter)


// Error handling middleware
app.use(errorLogger)

// creating server
app.listen(PORT, () => {
    console.log('Server is running on PORT ' + PORT)
})