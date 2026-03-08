const Submission = require('../models/Submission');

exports.getSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find().populate('teamId', 'name email department country');
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submissions', error: error.message });
    }
};

exports.submitScore = async (req, res) => {
    try {
        const { submissionId, judgeId, innovation, impact, feasibility, comments } = req.body;
        console.log('Scoring submission:', { submissionId, judgeId, innovation, impact, feasibility });

        const submission = await Submission.findById(submissionId);
        if (!submission) {
            console.error('Submission not found for scoring:', submissionId);
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Add or update score
        if (!submission.scores) submission.scores = []; // Safety check
        const existingScoreIndex = submission.scores.findIndex(s => s.judgeId === judgeId);
        if (existingScoreIndex > -1) {
            submission.scores[existingScoreIndex] = { judgeId, innovation, impact, feasibility, comments };
        } else {
            submission.scores.push({ judgeId, innovation, impact, feasibility, comments });
        }

        // Calculate average
        const total = submission.scores.reduce((acc, s) =>
            acc + (Number(s.innovation) || 0) +
            (Number(s.impact) || 0) +
            (Number(s.feasibility) || 0) +
            (Number(s.presentation) || 0), 0);

        const count = submission.scores.length;
        // 4 criteria per judge
        submission.averageScore = count > 0 ? total / (count * 4) : 0;

        await submission.save();
        res.status(200).json({ message: 'Score submitted successfully', submission });
    } catch (error) {
        console.error('Error submitting score:', error);
        res.status(500).json({ message: 'Error submitting score', error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { submissionId, status } = req.body;
        const submission = await Submission.findByIdAndUpdate(submissionId, { validationStatus: status }, { new: true });
        res.status(200).json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};

exports.getRankings = async (req, res) => {
    try {
        const rankings = await Submission.find()
            .populate('teamId', 'name department')
            .sort({ averageScore: -1 });
        res.status(200).json(rankings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rankings', error: error.message });
    }
};
