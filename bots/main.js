/**
 * Bot Orchestrator - Runs all automation bots for the Olympiad platform
 */
require('dotenv').config();
const { fork } = require('child_process');
const path = require('path');

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║    GAIO GLOBAL AI OLYMPIAD - BOT ORCHESTRATOR       ║');
console.log('╚══════════════════════════════════════════════════════════╝');
console.log(`[Orchestrator] Target API: ${process.env.API_BASE_URL || 'http://localhost:5000 (Fallback)'}`);
console.log('');

const bots = [
    { name: 'Analytics Bridge', file: 'analyticsBridge.js' },
    { name: 'Outreach Bot', file: 'outreach.js' },
    { name: 'Mentorship Bot', file: 'mentorshipBot.js' }
];

// Only start Discord bot if token is provided
if (process.env.DISCORD_TOKEN && process.env.DISCORD_TOKEN !== 'MOCK_TOKEN_FOR_PREVIEW') {
    bots.push({ name: 'Discord Bot', file: 'discord.js' });
}

const runningBots = [];

function startBot(botConfig) {
    console.log(`[Orchestrator] Starting ${botConfig.name}...`);
    const child = fork(path.join(__dirname, botConfig.file));

    child.on('error', (err) => {
        console.error(`[${botConfig.name}] Error:`, err.message);
    });

    child.on('exit', (code) => {
        console.log(`[${botConfig.name}] Exited with code ${code}`);
    });

    runningBots.push({ name: botConfig.name, process: child });
}

// Start all bots
bots.forEach(startBot);

console.log('');
console.log(`[Orchestrator] ${bots.length} bots initialized successfully.`);
console.log('[Orchestrator] Press Ctrl+C to stop all bots.');

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n[Orchestrator] Shutting down all bots...');
    runningBots.forEach(bot => {
        if (bot.process && !bot.process.killed) {
            bot.process.kill();
        }
    });
    process.exit(0);
});
