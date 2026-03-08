const mongoose = require('mongoose');

const ContactNodeSchema = new mongoose.Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
    icon: { type: String, required: true },
    type: { type: String, enum: ['EMAIL', 'SOCIAL', 'SUPPORT', 'LINK'], default: 'LINK' },
    redirectUrl: { type: String },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ContactNode', ContactNodeSchema);
