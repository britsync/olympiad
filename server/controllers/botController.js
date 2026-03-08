const BotStatus = require('../models/BotStatus');

exports.updateStatus = async (req, res) => {
    try {
        const { botName, status, currentActivity, tasksCompleted } = req.body;

        let bot = await BotStatus.findOne({ botName });

        if (!bot) {
            bot = new BotStatus({ botName });
        }

        bot.status = status || bot.status;
        bot.currentActivity = currentActivity || bot.currentActivity;
        bot.lastSync = Date.now();

        if (tasksCompleted) {
            bot.tasksCompleted += tasksCompleted;
        }

        if (currentActivity) {
            bot.logs.push({
                message: currentActivity,
                level: status === 'Error' ? 'error' : 'info'
            });
            // Keep only last 50 logs
            if (bot.logs.length > 50) bot.logs.shift();
        }

        await bot.save();
        res.status(200).json({ success: true, bot });
    } catch (error) {
        console.error('BOT_UPDATE_ERROR:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getBotStatuses = async (req, res) => {
    try {
        const bots = await BotStatus.find().sort({ lastSync: -1 });
        res.status(200).json(bots);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
