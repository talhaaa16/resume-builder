const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

mongoose.connect(process.env.DB)

mongoose.connection.on('connected', () => {
    console.log("DB connected")
})

mongoose.connection.on('error', (err) => {
    console.log("DB not connected:", err)
})

module.exports = mongoose