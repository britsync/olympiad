const nodemailer = require('nodemailer');
const axios = require('axios');
const dotenv = require('dotenv');
require('dotenv').config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

/**
 * Outreach Bot
 * Sends personalized invitations to universities and partners.
 */
async function sendOutreachEmail(targetEmail, universityName) {
    // DIAGNOSTIC LOGS
    console.log(`[Diagnostic] Using email: ${process.env.SMTP_USER || 'NOT_SET'}`);
    console.log(`[Diagnostic] Password length: ${process.env.SMTP_PASS ? process.env.SMTP_PASS.length : '0'} characters`);

    // Create a transporter (Optimized for Gmail)
    let transporterConfig = {
        auth: {
            user: process.env.SMTP_USER || 'mock_user',
            pass: process.env.SMTP_PASS || 'mock_pass'
        }
    };

    if (process.env.SMTP_USER && process.env.SMTP_USER.includes('gmail.com')) {
        transporterConfig.service = 'gmail';
    } else {
        transporterConfig.host = process.env.SMTP_HOST || 'smtp.ethereal.email';
        transporterConfig.port = parseInt(process.env.SMTP_PORT) || 587;
        transporterConfig.secure = process.env.SMTP_SECURE === 'true';
    }

    let transporter = nodemailer.createTransport(transporterConfig);

    const trackingId = Buffer.from(`${targetEmail}-${Date.now()}`).toString('base64');
    const openTrackingUrl = `${API_BASE_URL}/api/analytics/track-open/${trackingId}`;
    const registrationUrl = process.env.WEB_URL || 'http://localhost:5173/register';

    const mailOptions = {
        from: '"GAIO AI Olympiad" <outreach@GAIO.com>',
        to: targetEmail,
        subject: `Partnership: ${universityName} x Global AI Olympiad 2026`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h1 style="color: #4f46e5;">Hello ${universityName} Team,</h1>
                <p>We are officially inviting your bright minds to the 2026 **GAIO Global AI Tech Olympiad**.</p>
                <p>Join teams from Oxford, MIT, and Stanford in solving local community challenges using cutting-edge AI neural infrastructure.</p>
                <div style="margin: 30px 0; text-align: center;">
                    <a href="${registrationUrl}" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">SECURE YOUR SPOT</a>
                </div>
                <p>Track your application status via our integrated Discord layer.</p>
                <img src="${openTrackingUrl}" width="1" height="1" style="display:none;" />
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666;">Best regards,<br><strong>GAIO Global Automation System</strong></p>
            </div>
        `
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        console.log(`[Outreach] Email SENT to ${universityName} (${targetEmail}) | Tracking ID: ${trackingId}`);

        // Update BotStatus
        await axios.post(`${API_BASE_URL}/api/bot-status/update`, {
            botName: 'Outreach Bot',
            status: 'Active',
            currentActivity: `Sent email to ${universityName}`,
            tasksCompleted: 1 // Incrementally handled by server usually, but we'll send a signal
        });

        // Log the event to analytics
        await axios.post(`${API_BASE_URL}/api/analytics/log`, {
            type: 'EMAIL_OUTREACH',
            event: 'Email Sent',
            metadata: {
                email: targetEmail,
                university: universityName,
                trackingId,
                opened: false,
                sentAt: new Date().toISOString()
            }
        });

        return trackingId;
    } catch (error) {
        console.error(`[Outreach Error] Failed to process ${targetEmail}:`, error.message);
        await axios.post(`${API_BASE_URL}/api/bot-status/update`, {
            botName: 'Outreach Bot',
            status: 'Error',
            currentActivity: `Failure: ${error.message}`
        });
    }
}

// Demo Target List
const targetList = [
    { email: 'dean@oxford.edu', name: 'University of Oxford' },
    { email: 'innovation@mit.edu', name: 'MIT' },
    { email: 'tech-lead@stanford.edu', name: 'Stanford University' },
    { email: 'ai-society@ntu.edu.sg', name: 'NTU Singapore' }
];

// Start Outreach Sequence
console.log(`[Outreach] Commencing sequence for ${targetList.length} targets...`);
targetList.forEach((uni, index) => {
    setTimeout(() => sendOutreachEmail(uni.email, uni.name), index * 3000);
});

module.exports = { sendOutreachEmail };
