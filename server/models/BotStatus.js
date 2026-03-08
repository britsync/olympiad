const mongoose = require('mongoose');

const botStatusSchema = new mongoose.Schema({
    botName: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Idle', 'Error', 'Offline'], default: 'Active' },
    lastSync: { type: Date, default: Date.now },
    tasksCompleted: { type: Number, default: 0 },
    currentActivity: { type: String },
    logs: [{
        timestamp: { type: Date, default: Date.now },
        message: { type: String },
        level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' }
    }]
}, { timestamps: true });

module.exports = mongoose.model('BotStatus', botStatusSchema);
