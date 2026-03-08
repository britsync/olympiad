const mongoose = require('mongoose');

const DynamicContentSchema = new mongoose.Schema({
    sectionId: { type: String, required: true }, // e.g., Hero, About, VisionMatrix
    key: { type: String, required: true }, // e.g., main_title, subtitle, vision_entry_1
    value: { type: String, required: true },
    language: { type: String, default: 'EN' }
}, { timestamps: true });

module.exports = mongoose.model('DynamicContent', DynamicContentSchema);
