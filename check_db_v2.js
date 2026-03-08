const mongoose = require('mongoose');
const path = require('path');

// Dynamically require models from absolute paths to avoid resolution issues
const Participant = require(path.join(__dirname, 'server', 'models', 'Participant'));

async function check() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/olympiad', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected.');

        const participants = await Participant.find();
        console.log('--- PARTICIPANTS REPORT ---');
        console.log('Total Count:', participants.length);
        if (participants.length > 0) {
            participants.forEach((p, i) => {
                console.log(`[${i}] Name: ${p.teamName}, Type: ${p.type}, Category: ${p.category}`);
            });
        } else {
            console.log('No participants found.');
        }

        console.log('---------------------------');
        process.exit(0);
    } catch (err) {
        console.error('FAILED:', err.message);
        process.exit(1);
    }
}

check();
