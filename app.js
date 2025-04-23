// Module imports
const express = require('express')
const dotenv = require('dotenv')


const app = express()
dotenv.config()

let PORT = process.env.PORT || 3000

// creating server
app.listen(PORT, () => {
    console.log('Server is running on PORT ' + PORT)
})