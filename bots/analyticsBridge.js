const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

/**
 * Analytics Bridge Bot
 * Gathers data from Website and Discord, feeding it into Centralized Dashboard.
 */

async function syncData() {
    try {
        console.log('[Bot-Analytics] Syncing Discord engagement with Web registrations...');

        // 1. Fetch Discord metrics (Mocked for demo, in production would use discord.js client)
        const discordStats = { activeUsers: 1420, messagesToday: 5300 };

        // 2. Fetch Website metrics
        let webStats = { teamCount: 0, submissionCount: 0 };
        try {
            const response = await axios.get(`${API_BASE_URL}/api/analytics`);
            webStats = {
                teamCount: response.data.participants,
                submissionCount: response.data.submissions
            };
        } catch (err) {
            console.warn('[Bot-Analytics] Could not fetch real web metrics, using defaults.');
        }

        // 3. Log Aggregated Data to Centralized Dashboard
        await axios.post(`${API_BASE_URL}/api/analytics/log`, {
            type: 'Bot',
            event: 'DailySync',
            metadata: {
                discord: discordStats,
                web: webStats,
                timestamp: new Date().toISOString()
            }
        });

        // 4. Update BotStatus
        await axios.post(`${API_BASE_URL}/api/bot-status/update`, {
            botName: 'Analytics Bridge',
            status: 'Active',
            currentActivity: `Synced ${webStats.teamCount} teams and ${webStats.submissionCount} submissions`
        });

        console.log(`[Bot-Analytics] Sync Complete. (Teams: ${webStats.teamCount}, Submissions: ${webStats.submissionCount})`);
    } catch (error) {
        console.log('[Bot-Analytics] Sync Error:', error.message);
        try {
            await axios.post(`${API_BASE_URL}/api/bot-status/update`, {
                botName: 'Analytics Bridge',
                status: 'Error',
                currentActivity: `Sync Error: ${error.message}`
            });
        } catch (e) { }
    }
}

// Run sync every minute for demo
setInterval(syncData, 60000);
syncData();
