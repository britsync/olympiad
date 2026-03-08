const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNo: { type: String },
    country: { type: String },
    department: { type: String, enum: ['Individual', 'Startup'] }, // Reusing 'type' logic but simplified

    // Legacy / Optional fields kept for backward compatibility if needed, or just remove if data loss is fine. 
    // User requested "thats it", so I will make them optional/removed from requirement.
    teamName: { type: String }, // Can be auto-filled with name
    type: { type: String, default: 'Individual' },
    category: { type: String },
    members: [{
        name: String,
        email: String,
        role: String
    }],
    projectIdea: { type: String },
    institutionalNode: { type: String },

    registrationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Participant', ParticipantSchema);
