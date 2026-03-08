const mongoose = require('mongoose');
const Participant = require('./server/models/Participant');

async function checkParticipants() {
    try {
        await mongoose.connect('mongodb://localhost:27017/olympiad');
        const participants = await Participant.find().sort({ registrationDate: -1 }).limit(5);
        console.log('--- RECENT PARTICIPANTS ---');
        participants.forEach(p => {
            console.log(`Team: ${p.teamName}, Type: ${p.type}, Category: ${p.category}`);
        });
        mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkParticipants();
