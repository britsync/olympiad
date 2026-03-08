const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

/**
 * Mentorship Coordination Bot
 * Matches participants with experts based on skills.
 */
async function syncMentorship() {
    try {
        console.log('[Bot-Mentor] Running mentorship matching sequence...');

        // 1. Fetch available mentors and unassigned teams
        // (Mocked for demonstration based on GAIO strategy)
        const activity = "Matching teams with AI Specialists and Branding Mentors";

        await axios.post(`${API_BASE_URL}/api/bot-status/update`, {
            botName: 'Mentorship Bot',
            status: 'Active',
            currentActivity: activity,
            tasksCompleted: 4
        });

        console.log(`[Bot-Mentor] ${activity} | OK`);
    } catch (error) {
        console.error('[Bot-Mentor] Error:', error.message);
    }
}

// Run every 5 minutes
setInterval(syncMentorship, 300000);
syncMentorship();
