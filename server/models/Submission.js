const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant', required: true },
    category: { type: String, enum: ['Startup', 'Project'], required: true },
    videoLink: String,
    pdfLink: String,
    pdfTextContent: String,
    validationStatus: { type: String, enum: ['Pending', 'Validated', 'Rejected', 'Requirements Not Met', 'Award Winner'], default: 'Pending' },
    aiInsights: String,
    scores: [{
        judgeId: String,
        innovation: { type: Number, min: 0, max: 10 },
        impact: { type: Number, min: 0, max: 10 },
        feasibility: { type: Number, min: 0, max: 10 },
        presentation: { type: Number, min: 0, max: 10 },
        comments: String
    }],
    averageScore: { type: Number, default: 0 },
    submissionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
