const mongoose = require('mongoose');

const GatewayNodeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    icon: { type: String, required: true, default: 'Cpu' },
    color: { type: String, default: 'text-aether-gold' },
    glow: { type: String, default: 'rgba(197, 160, 89, 0.1)' },
    order: { type: Number, default: 0 },
    subtext: { type: String },
    link: { type: String },
    category: { type: String, default: 'INFRASTRUCTURE' }, // e.g., INFRASTRUCTURE, SYNDICATE, SECURITY, ROADMAP, PARTNER, ACADEMY_MODULE, STRATEGY_PILLAR
    details: { type: String },
    topics: { type: [String] },
    payload: { type: mongoose.Schema.Types.Mixed },
    downloadLink: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('GatewayNode', GatewayNodeSchema);
