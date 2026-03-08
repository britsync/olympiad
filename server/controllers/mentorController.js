const Mentor = require('../models/Mentor');

exports.getMentors = async (req, res) => {
    try {
        const mentors = await Mentor.find();
        res.status(200).json(mentors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mentors' });
    }
};

exports.addMentor = async (req, res) => {
    try {
        const mentor = new Mentor(req.body);
        await mentor.save();
        res.status(201).json(mentor);
    } catch (error) {
        res.status(500).json({ message: 'Error adding mentor' });
    }
};
