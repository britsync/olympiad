const mongoose = require('mongoose');

const galaRSVPSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant', required: true },
    guestName: { type: String, required: true },
    email: { type: String, required: true },
    dietaryPreferences: { type: String, default: 'None' },
    specialRequirements: { type: String },
    guestCount: { type: Number, default: 1 },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Waitlisted'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('GalaRSVP', galaRSVPSchema);
