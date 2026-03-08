const Participant = require('../models/Participant');
const Submission = require('../models/Submission');
const Sponsor = require('../models/Sponsor');
const Analytics = require('../models/Analytics');
const SystemSettings = require('../models/SystemSettings');

// Helper to get singleton settings safely
const getSettings = async () => {
    try {
        // Try to find or create atomically
        let settings = await SystemSettings.findOneAndUpdate(
            { isSingleton: true },
            {},
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        return settings;
    } catch (error) {
        console.error('SETTINGS_FETCH_ERROR:', error);
        throw error;
    }
};

exports.trackVisitor = async (req, res) => {
    try {
        const settings = await getSettings();
        settings.visitors += 1;
        await settings.save();
        res.status(200).json({ visitors: settings.visitors });
    } catch (error) {
        console.error('TRACK_VISITOR_ERROR:', error);
        res.status(500).json({ message: 'Error tracking visitor', error: error.message });
    }
};

exports.updateMinistryStats = async (req, res) => {
    try {
        const { count } = req.body;
        const settings = await getSettings();
        settings.ministryInvolvement = count;
        await settings.save();
        res.status(200).json({ ministryInvolvement: settings.ministryInvolvement });
    } catch (error) {
        res.status(500).json({ message: 'Error updating ministry stats' });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        // 1. Countries (Unique Count)
        const countriesList = await Participant.distinct('country');
        const countriesCount = countriesList.length;

        // 2. Startups (Department Filter)
        const startupsCount = await Participant.countDocuments({ department: 'Startup' });

        // 3. Visitors & Ministry (From Settings)
        const settings = await getSettings();

        // 4. Submissions (Standard Count)
        const submissionCount = await Submission.countDocuments();

        // 5. Total Participants
        const participantCount = await Participant.countDocuments();

        res.status(200).json({
            countries: countriesCount,
            startups: startupsCount,
            visitors: settings.visitors,
            ministryInvolvement: settings.ministryInvolvement,
            submissions: submissionCount,
            participants: participantCount
        });
    } catch (error) {
        console.error('ANALYTICS_ERROR:', error);
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
};

exports.logEvent = async (req, res) => {
    // Legacy logging - keeping for backward compatibility if needed
    res.status(200).send('OK');
};
