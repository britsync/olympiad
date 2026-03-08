const { PDFParse } = require('pdf-parse');
const Submission = require('../models/Submission');
const Participant = require('../models/Participant');
const fs = require('fs');
const mongoose = require('mongoose');

exports.submitProject = async (req, res) => {
    try {
        const { teamId, videoLink, category } = req.body;
        console.log('--- SUBMISSION_START ---');
        console.log('Payload:', { teamId, videoLink, category });
        console.log('File:', req.file);

        if (!req.file) {
            return res.status(400).json({ message: 'PDF file is required' });
        }

        // Try to find team by ID first, then by Name
        let team;
        if (mongoose.Types.ObjectId.isValid(teamId)) {
            team = await Participant.findById(teamId);
        }

        if (!team) {
            // Helper to escape regex special characters
            const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const escapedTeamId = escapeRegExp(teamId);

            // 1. Try finding by Name (case-insensitive)
            team = await Participant.findOne({ name: new RegExp(`^${escapedTeamId}$`, 'i') });

            // 2. If not found, and it looks like a short ID (6 hex chars), try matching suffix of _id
            if (!team && teamId.length === 6) {
                const potentialMatches = await Participant.aggregate([
                    { $addFields: { strId: { $toString: "$_id" } } },
                    { $match: { strId: { $regex: `${escapedTeamId}$`, $options: 'i' } } }
                ]);

                if (potentialMatches.length > 0) {
                    team = potentialMatches[0];
                }
            }
        }

        if (!team) {
            return res.status(404).json({ message: 'UNIT_NOT_FOUND: Access key does not match any registered team.' });
        }

        const dataBuffer = fs.readFileSync(req.file.path);
        const parser = new PDFParse({ data: dataBuffer });
        const pdfData = await parser.getText();
        const text = pdfData.text;

        // Keyword validation logic
        const keywords = ['Sustainability', 'Community Impact', 'AI Development', 'Local Community', 'Community Development'];
        const foundKeywords = keywords.filter(keyword =>
            text.toLowerCase().includes(keyword.toLowerCase())
        );

        // Auto-validation status based on strategy
        let validationStatus = 'Pending';
        if (foundKeywords.length >= 2) {
            validationStatus = 'Validated';
        } else {
            validationStatus = 'Requirements Not Met';
        }

        const submission = new Submission({
            teamId: team._id,
            category,
            videoLink,
            pdfLink: req.file.path,
            pdfTextContent: text.substring(0, 5000), // Limit text storage
            validationStatus,
            aiInsights: `Found keywords: ${foundKeywords.join(', ')}. Word count: ${pdfData.total} pages.`
        });

        await submission.save();

        res.status(201).json({
            message: 'Submission processed',
            submissionId: submission._id,
            validationStatus,
            foundKeywords
        });
    } catch (error) {
        console.error('CRITICAL_SUBMISSION_ERROR:', error);
        // Write to a temporary debug file since terminal output is tricky
        fs.appendFileSync('submission_debug.log', `${new Date().toISOString()} - ERROR: ${error.message}\nStack: ${error.stack}\n`);
        res.status(500).json({ message: 'Error submitting project', error: error.message });
    }
};

exports.getSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find().populate('teamId');
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submissions', error: error.message });
    }
};

exports.getWinners = async (req, res) => {
    try {
        // Fetch only validated winners, sorted by score descending
        const winners = await Submission.find({ validationStatus: 'Award Winner' })
            .populate('teamId')
            .sort({ averageScore: -1 }) // Sort by highest average score
            .limit(3);

        res.status(200).json(winners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching winners', error: error.message });
    }
};

exports.deleteSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Submission.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        res.status(200).json({ message: 'Submission deleted successfully' });
    } catch (error) {
        console.error('DELETE_SUBMISSION_ERROR:', error);
        res.status(500).json({ message: 'Error deleting submission', error: error.message });
    }
};
