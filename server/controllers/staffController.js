const StaffMember = require('../models/StaffMember');

exports.getStaff = async (req, res) => {
    try {
        const staff = await StaffMember.find().sort({ order: 1 });
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching staff', error: error.message });
    }
};

exports.createStaff = async (req, res) => {
    try {
        const newStaff = new StaffMember(req.body);
        await newStaff.save();
        res.status(201).json(newStaff);
    } catch (error) {
        res.status(500).json({ message: 'Error creating staff', error: error.message });
    }
};

exports.updateStaff = async (req, res) => {
    try {
        const updatedStaff = await StaffMember.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedStaff);
    } catch (error) {
        res.status(500).json({ message: 'Error updating staff', error: error.message });
    }
};

exports.deleteStaff = async (req, res) => {
    try {
        await StaffMember.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Staff member deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting staff', error: error.message });
    }
};

exports.uploadIndustryImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Return the path that the client can use to access the image
        const filePath = `/uploads/industries/${req.file.filename}`;
        res.status(200).json({ url: filePath });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image', error: error.message });
    }
};
