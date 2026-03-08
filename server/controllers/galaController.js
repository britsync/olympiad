const GalaRSVP = require('../models/GalaRSVP');
const Participant = require('../models/Participant');
const mongoose = require('mongoose');

exports.submitRSVP = async (req, res) => {
    try {
        let { teamId, guestName, email, dietaryPreferences, specialRequirements, guestCount } = req.body;

        // Try to find team by ID first, then by Name
        let team;
        if (mongoose.Types.ObjectId.isValid(teamId)) {
            team = await Participant.findById(teamId);
        }

        if (!team) {
            team = await Participant.findOne({ teamName: new RegExp(`^${teamId}$`, 'i') });
        }

        if (!team) {
            return res.status(404).json({ message: 'UNIT_NOT_FOUND: Access key does not match any registered team.' });
        }

        const rsvp = new GalaRSVP({
            teamId: team._id,
            guestName,
            email,
            dietaryPreferences,
            specialRequirements,
            guestCount: parseInt(guestCount) || 1
        });

        await rsvp.save();
        res.status(201).json({ message: 'RSVP successful', rsvp });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting RSVP', error: error.message });
    }
};

exports.getRSVPs = async (req, res) => {
    try {
        const rsvps = await GalaRSVP.find().populate('teamId');
        res.status(200).json(rsvps);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching RSVPs' });
    }
};
