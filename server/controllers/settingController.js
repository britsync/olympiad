const Setting = require('../models/Setting');

// Get a setting by key
exports.getSetting = async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: req.params.key });
        if (!setting) {
            // Return default if not found (seed data logic)
            let defaultValue = '';
            if (req.params.key === 'admin_password') defaultValue = 'GAIO_2026';
            if (req.params.key === 'sponsor_password') defaultValue = 'SYNDICATE_2026';
            return res.json({ key: req.params.key, value: defaultValue });
        }
        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update or create a setting
exports.updateSetting = async (req, res) => {
    const { key, value } = req.body;
    try {
        let setting = await Setting.findOne({ key });
        if (setting) {
            setting.value = value;
            await setting.save();
        } else {
            setting = new Setting({ key, value });
            await setting.save();
        }
        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify password
exports.verifyPassword = async (req, res) => {
    const { key, password } = req.body;
    try {
        const setting = await Setting.findOne({ key });
        const actualPassword = setting ? setting.value : (key === 'admin_password' ? 'GAIO_2026' : 'SYNDICATE_2026');

        if (password === actualPassword) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Invalid Protocol Key' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
