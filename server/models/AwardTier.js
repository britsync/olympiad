const mongoose = require('mongoose');

const AwardTierSchema = new mongoose.Schema({
    tierName: { type: String, required: true }, // e.g., TITAN_NODE, ELITE_ARRAY
    reward: { type: String, required: true }, // e.g., $50,000 SEED_FUND
    description: { type: String, required: true },
    useGAIOLogo: { type: Boolean, default: true },
    customLogoUrl: { type: String },
    icon: { type: String, default: 'Award' },
    color: { type: String },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('AwardTier', AwardTierSchema);
