const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    expertise: [{ type: String }], // AI, Finance, Branding, etc.
    company: { type: String },
    bio: { type: String },
    linkedIn: { type: String },
    isAssigned: { type: Boolean, default: false },
    assignedTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }
}, { timestamps: true });

module.exports = mongoose.model('Mentor', mentorSchema);
