const Sponsor = require('../models/Sponsor');

exports.getSponsors = async (req, res) => {
    try {
        const sponsors = await Sponsor.find().sort({ createdAt: -1 });
        res.status(200).json(sponsors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sponsors', error: error.message });
    }
};

exports.addSponsor = async (req, res) => {
    try {
        const sponsor = new Sponsor(req.body);
        await sponsor.save();
        res.status(201).json(sponsor);
    } catch (error) {
        res.status(500).json({ message: 'Error adding sponsor', error: error.message });
    }
};

exports.updateSponsor = async (req, res) => {
    try {
        const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(sponsor);
    } catch (error) {
        res.status(500).json({ message: 'Error updating sponsor', error: error.message });
    }
};

exports.deleteSponsor = async (req, res) => {
    try {
        await Sponsor.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Sponsor removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting sponsor', error: error.message });
    }
};
