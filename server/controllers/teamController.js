const Participant = require('../models/Participant');

const { sendEmail } = require('../services/emailService');

exports.registerTeam = async (req, res) => {
    try {
        const { name, email, contactNo, country, department } = req.body;
        console.log('REGISTRATION_PAYLOAD:', { name, email, contactNo, country, department });

        // Check if user already exists
        const existingUser = await Participant.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        const newUser = new Participant({
            name,
            email,
            contactNo,
            country,
            department,
            teamName: name, // Using name as teamName for backward compatibility/uniqueness check if needed (though we relaxed it)
            type: department === 'Startup' ? 'Startup' : 'Individual', // Mapping department to type/category loosely
            category: department
        });

        await newUser.save();

        // --- Send Emails ---

        // 1. User Email
        const userHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #c5a059;">Welcome to Global AI Olympiad!</h2>
                <p>Dear ${name},</p>
                <p>You have successfully registered for the Global AI Olympiad.</p>
                <p><strong>Registration Details:</strong></p>
                <ul>
                    <li>Name: ${name}</li>
                    <li>Department: ${department}</li>
                    <li>Country: ${country}</li>
                </ul>
                <p>Your unique QR Code data: <strong>OLYMPIAD-${name}-${newUser._id}</strong></p>
                <p>Please keep this email for your records.</p>
                <br>
                <p>Best Regards,<br>Global AI Olympiad Team</p>
            </div>
        `;
        await sendEmail(email, 'Registration Successful - Global AI Olympiad', userHtml);

        // 2. Admin Notification
        const adminHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #0f172a;">New Registration Alert</h2>
                <p>A new participant has registered.</p>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Contact:</strong> ${contactNo}</li>
                    <li><strong>Country:</strong> ${country}</li>
                    <li><strong>Department:</strong> ${department}</li>
                </ul>
            </div>
        `;
        await sendEmail('britsyncuk@gmail.com', 'New Registration Alert', adminHtml);

        res.status(201).json({ message: 'Registration successful', teamId: newUser._id });
    } catch (error) {
        console.error('REGISTRATION_ERROR:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.getTeams = async (req, res) => {
    try {
        const teams = await Participant.find();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teams', error: error.message });
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Participant.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Participant not found' });
        }

        res.status(200).json({ message: 'Participant deleted successfully' });
    } catch (error) {
        console.error('DELETE_PARTICIPANT_ERROR:', error);
        res.status(500).json({ message: 'Error deleting participant', error: error.message });
    }
};
