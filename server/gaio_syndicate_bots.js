/**
 * GAIO_SYNDICATE_BOTS_V1
 * Integrated Prototype for the 3-Core Bot Architecture
 * 1. EMAIL_AUTOMATION_NODE
 * 2. EVENT_MANAGEMENT_NODE
 * 3. ANALYTICS_TELEMETRY_NODE
 */

const axios = require('axios');
require('dotenv').config();

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000/api';

class GaioNode {
    constructor(botName, role) {
        this.botName = botName;
        this.role = role;
        this.status = 'Idle';
        this.tasksCompleted = 0;
        this.heartbeatInterval = 30000; // 30s
    }

    async syncStatus(activity, tasks = 0) {
        try {
            this.tasksCompleted += tasks;
            const response = await axios.post(`${API_BASE}/bots/update`, {
                botName: this.botName,
                status: 'Active',
                currentActivity: activity,
                tasksCompleted: tasks
            });
            console.log(`[${this.botName}] SYNC_SUCCESS: ${activity}`);
        } catch (error) {
            console.error(`[${this.botName}] SYNC_ERROR:`, error.message);
            if (error.response && error.response.data) {
                console.error(`[${this.botName}] SERVER_RESPONSE:`, JSON.stringify(error.response.data));
            }
        }
    }

    start() {
        console.log(`[${this.botName}] NODE_INITIALIZED: ${this.role}`);
        this.status = 'Active';
        setInterval(() => {
            this.syncStatus('HEARTBEAT_SIGNAL_STABLE');
        }, this.heartbeatInterval);
    }
}

// 1. EMAIL_AUTOMATION_NODE
const EmailNode = new GaioNode('EMAIL_BOT', 'OUTREACH_&_SPONSOR_SYNC');
EmailNode.onRegistration = (email) => {
    EmailNode.syncStatus(`SENDING_WELCOME_PROTOCOL: ${email}`, 1);
};

// 2. EVENT_MANAGEMENT_NODE
const EventNode = new GaioNode('EVENT_BOT', 'PARTICIPANT_QUERY_ENGINE');
EventNode.onQuery = (queryType) => {
    EventNode.syncStatus(`RESOLVING_QUERY: ${queryType}`, 1);
};

// 3. ANALYTICS_TELEMETRY_NODE
const AnalyticsNode = new GaioNode('ANALYTICS_BOT', 'DATA_AGGREGATION_&_INSIGHTS');
AnalyticsNode.onDataSync = () => {
    AnalyticsNode.syncStatus(`TELEMETRY_SYNC_COMPLETE`, 5);
};

// Initialize Nodes
const initializeSyndicate = () => {
    console.log('--- GAIO SYNDICATE BOT ARCHITECTURE BOOTING ---');
    EmailNode.start();
    EventNode.start();
    AnalyticsNode.start();

    // Simulate some initial activity
    setTimeout(() => EmailNode.syncStatus('SCANNING_UNIVERSITY_ARCHIVES', 12), 5000);
    setTimeout(() => EventNode.syncStatus('PROCESSING_PRE_REG_BUFFER', 8), 7000);
    setTimeout(() => AnalyticsNode.syncStatus('COMPILING_ENGAGEMENT_MATRIX', 1), 10000);
};

if (require.main === module) {
    initializeSyndicate();
}

module.exports = { EmailNode, EventNode, AnalyticsNode };
