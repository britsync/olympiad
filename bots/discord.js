const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
    // 1. Event Management
    new SlashCommandBuilder().setName('register').setDescription('Register your team').addStringOption(o => o.setName('team').setDescription('Team Name').setRequired(true)),
    new SlashCommandBuilder().setName('status').setDescription('Get Olympiad status').addStringOption(o => o.setName('detail').setDescription('Detail level').addChoices({ name: 'Summary', value: 'summary' }, { name: 'Full', value: 'full' })),
    new SlashCommandBuilder().setName('deadline').setDescription('Check deadlines').addStringOption(o => o.setName('type').setDescription('Type').setRequired(true).addChoices({ name: 'Registration', value: 'reg' }, { name: 'Submission', value: 'sub' })),
    new SlashCommandBuilder().setName('faq').setDescription('Olympiad FAQs'),
    new SlashCommandBuilder().setName('roadmap').setDescription('View GAIO 5-year roadmap'),

    // 2. Mentorship
    new SlashCommandBuilder().setName('mentor-request').setDescription('Request a mentor session').addStringOption(o => o.setName('topic').setDescription('Topic (Finance/Tech/Branding)').setRequired(true)),
    new SlashCommandBuilder().setName('mentor-match').setDescription('Get matched with a mentor'),

    // 3. Submission
    new SlashCommandBuilder().setName('submit-init').setDescription('Start a project submission'),
    new SlashCommandBuilder().setName('submit-verify').setDescription('Verify your submission status'),

    // 4. Voting
    new SlashCommandBuilder().setName('vote').setDescription('Vote for Fan Favorite').addStringOption(o => o.setName('team').setDescription('Team Name/ID').setRequired(true)),
    new SlashCommandBuilder().setName('leaderboard').setDescription('View current top-ranked projects'),

    // 5. Communication
    new SlashCommandBuilder().setName('announce').setDescription('Send a global announcement (Admin only)').addStringOption(o => o.setName('content').setDescription('Message').setRequired(true)),
    new SlashCommandBuilder().setName('broadcast').setDescription('Broadcast message to all channels'),

    // 6. Gala
    new SlashCommandBuilder().setName('rsvp-gala').setDescription('Confirm status for Royal Museum gala').addIntegerOption(o => o.setName('guests').setDescription('Guest count')),
    new SlashCommandBuilder().setName('gala-info').setDescription('Event details, dress code, and location'),

    // 7. Feedback
    new SlashCommandBuilder().setName('feedback-submit').setDescription('Submit event feedback').addStringOption(o => o.setName('msg').setDescription('Feedback message').setRequired(true)),
    new SlashCommandBuilder().setName('survey').setDescription('Take the participant survey')
].map(command => command.toJSON());

const TOKEN = process.env.DISCORD_TOKEN || 'MOCK_TOKEN_FOR_PREVIEW';

const API_BASE_URL = 'http://localhost:5000/api';

async function updateBotStatus(activity, status = 'Active') {
    try {
        await axios.post(`${API_BASE_URL}/bot-status/update`, {
            botName: 'Discord Bot',
            status,
            currentActivity: activity
        });
    } catch (e) {
        console.error('[Discord Bot] Status reporting failed');
    }
}

client.on('ready', () => {
    console.log(`[Discord Bot] Logged in as ${client.user.tag}!`);
    updateBotStatus('Listening for commands');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName, options } = interaction;

    updateBotStatus(`Handling /${commandName}`);

    switch (commandName) {
        case 'register':
            const team = options.getString('team');
            await interaction.reply(`[PROTOCOL_INIT] Team **${team}** successfully registered to the GAIO Decentralized Grid.`);
            break;
        case 'status':
            await interaction.reply({ content: '```yaml\nGAIO_OS_STATUS: STABLE\nPARTICIPANTS: 1240\nNODES_ACTIVE: 42\nLATENCY: 12ms\n```', ephemeral: true });
            break;
        case 'deadline':
            const type = options.getString('type');
            const date = type === 'reg' ? 'APRIL 30, 2026' : 'JUNE 15, 2026';
            await interaction.reply(`The next critical threshold [${type.toUpperCase()}] is set for **${date}**.`);
            break;
        case 'roadmap':
            await interaction.reply('**GAIO 5-YEAR VISION:**\n1. Global Expansion (15+ countries)\n2. GAIO Academy Launch\n3. Institutional R&D Labs\n4. Global Grand Finale (London)\n5. GAIO Venture Fund activation.');
            break;
        case 'mentor-request':
            const topic = options.getString('topic');
            await interaction.reply(`Requesting specialized mentorship in **${topic}**. Matching node active...`);
            break;
        case 'submit-init':
            await interaction.reply('Submission port opened. Please provide the project URL and documentation link via the private terminal.');
            break;
        case 'vote':
            const voteFor = options.getString('team');
            await interaction.reply(`Vote recorded for **${voteFor}**. Community sentiment synchronized.`);
            break;
        case 'rsvp-gala':
            const guests = options.getInteger('guests') || 0;
            await interaction.reply(`RSVP Confirmed for Royal Museum of Science. Guests: **${guests}**. Access tokens generated.`);
            break;
        case 'feedback-submit':
            await interaction.reply('Neural feedback received. Your input has been serialized for the steering committee.');
            break;
        default:
            await interaction.reply({ content: `Command /${commandName} acknowledged. Processing...`, ephemeral: true });
    }
});

// Mock registration of commands (in a real env, this would run once)
if (TOKEN !== 'MOCK_TOKEN_FOR_PREVIEW') {
    client.login(TOKEN);
} else {
    console.log('[Discord Bot] Running in MOCK mode. Set DISCORD_TOKEN in .env for real functionality.');
}
