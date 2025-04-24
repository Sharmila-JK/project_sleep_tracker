// Module imports
const express = require('express')
const dotenv = require('dotenv')
const errorLogger = require('./utilities/errorLogger')
const requestLogger = require('./utilities/requestLogger')

const app = express()
dotenv.config()

let PORT = process.env.PORT || 3000

app.use(requestLogger)

app.get('/hello',(req, res, next) => {
    let err = new Error("Error")
    next(err)
})

// Error handling middleware
app.use(errorLogger)

// creating server
app.listen(PORT, () => {
    console.log('Server is running on PORT ' + PORT)
})