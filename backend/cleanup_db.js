const mongoose = require('mongoose');
require('dotenv').config();

async function cleanup() {
    try {
        await mongoose.connect(process.env.DB);
        console.log("Connected to DB for cleanup...");

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        // Drop the index named 'email_1'
        try {
            await collection.dropIndex('email_1');
            console.log("Successfully dropped legacy 'email_1' index.");
        } catch (err) {
            if (err.codeName === 'IndexNotFound' || err.code === 27) {
                console.log("Index 'email_1' not found, skipping.");
            } else {
                throw err;
            }
        }

        console.log("Cleanup complete!");
        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
}

cleanup();
