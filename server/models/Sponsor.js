const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    interestLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Signed'], default: 'Medium' },
    tier: { type: String, enum: ['Gold', 'Silver', 'Bronze', 'Platinum', 'Title Sponsor', 'Custom'], default: 'Bronze' },
    pillar: { type: String, enum: ['Strategic', 'Continental', 'Regional', 'Media', 'Talent', 'Startup', 'Institutional'], default: 'Strategic' },
    continent: { type: String, enum: ['Global', 'Asia', 'Europe', 'Africa', 'Middle East', 'Americas'], default: 'Global' },
    status: { type: String, enum: ['Lead', 'In Discussion', 'Contract Sent', 'Partner'], default: 'Lead' },
    notes: { type: String },
    estimatedValue: { type: Number, default: 0 },
    lastContactDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Sponsor', sponsorSchema);
