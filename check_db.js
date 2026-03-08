const mongoose = require('mongoose');
const Participant = require('./server/models/Participant');

async function check() {
    try {
        await mongoose.connect('mongodb://localhost:27017/olympiad');
        console.log('Connected to DB');
        const participants = await Participant.find();
        console.log('Total Participants:', participants.length);
        console.log('Participants Data:', JSON.stringify(participants, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

check();
