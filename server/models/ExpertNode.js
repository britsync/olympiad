const mongoose = require('mongoose');

const ExpertNodeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    expertise: { type: [String], required: true },
    company: { type: String, required: true },
    bio: { type: String, required: true },
    linkedin: { type: String },
    photo: { type: String },
    category: { type: String, default: 'JUDGE' }, // JUDGE, MENTOR, ADVISOR
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ExpertNode', ExpertNodeSchema);
