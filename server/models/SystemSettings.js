const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
    visitors: {
        type: Number,
        default: 0
    },
    ministryInvolvement: {
        type: Number,
        default: 0
    },
    // Singleton pattern enforcement
    isSingleton: {
        type: Boolean,
        default: true,
        unique: true
    }
});

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
