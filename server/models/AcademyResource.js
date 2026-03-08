const mongoose = require('mongoose');

const AcademyResourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    type: { type: String, enum: ['VIDEO', 'PDF_GUIDE', 'DATASET', 'WORKSHOP', 'DOC', 'VIDEO_SERIES', 'WHITE_PAPER', 'BLUEPRINT', 'VIDEO_LECTURE', 'LIVE_SESSION'], default: 'VIDEO' },
    description: { type: String },
    downloadLink: { type: String },
    size: { type: String },
    duration: { type: String },
    pages: { type: String },
    format: { type: String },
    overview: { type: String },
    specs: { type: [String] },
    isPreviewable: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('AcademyResource', AcademyResourceSchema);
