const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

if (!process.env.DB) {
    console.error("FATAL ERROR: DB environment variable is not defined.");
} else {
    mongoose.connect(process.env.DB).catch(err => {
        console.error("Initial DB connection error:", err);
    });
}


mongoose.connection.on('connected', () => {
    console.log("DB connected")
})

mongoose.connection.on('error', (err) => {
    console.log("DB not connected:", err)
})

module.exports = mongoose