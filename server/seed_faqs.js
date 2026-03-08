const mongoose = require('mongoose');
const FAQ = require('./models/FAQ');

const seedFaqs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('CONNECTED_TO_DB');

        const faqs = [
            {
                question: 'What is the Global AI Olympiad?',
                answer: 'GAIO is a premier competition designed to foster innovation and collaboration in the field of Artificial Intelligence on a global scale.',
                order: 1
            },
            {
                question: 'Who can participate?',
                answer: 'Participation is open to students, researchers, and AI enthusiasts from all over the world. Check the eligibility section for specific details.',
                order: 2
            },
            {
                question: 'How do I submit my project?',
                answer: 'Projects can be submitted through the "Submit Project" portal on the homepage. Ensure you follow the submission guidelines.',
                order: 3
            }
        ];

        await FAQ.deleteMany({});
        await FAQ.insertMany(faqs);
        console.log('FAQS_SEEDED_SUCCESSFULLY');
        process.exit(0);
    } catch (error) {
        console.error('SEEDING_FAILED:', error);
        process.exit(1);
    }
};

seedFaqs();
