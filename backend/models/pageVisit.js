const mongoose = require('mongoose');

const PageVisitSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true }, // "YYYY-MM-DD"
    count: { type: Number, default: 0 },
    uniqueIPs: [{ type: String }]
});

module.exports = mongoose.model('PageVisit', PageVisitSchema);
