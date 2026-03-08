const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
    type: { type: String, enum: ['Email', 'Discord', 'Web', 'EMAIL_OUTREACH', 'Bot'], required: true },
    event: { type: String, required: true },
    metadata: { type: Object },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
