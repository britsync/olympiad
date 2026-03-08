const mongoose = require('mongoose');
const Submission = require('./models/Submission');
// Mock Participant model to avoid schema errors if strict populated
require('./models/Participant');
const dotenv = require('dotenv');
dotenv.config();

async function checkLink() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const sub = await Submission.findOne().sort({ submissionDate: -1 });
        console.log('Latest Submission PDF Link:', sub ? sub.pdfLink : 'No submission found');
        mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkLink();
