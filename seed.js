const mongoose = require('mongoose');
const Mentor = require('./server/models/Mentor');
const Sponsor = require('./server/models/Sponsor');
const dotenv = require('dotenv');
dotenv.config({ path: './server/.env' });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/olympiad');

        // Clear existing
        await Mentor.deleteMany({});
        await Sponsor.deleteMany({});

        const mentors = [
            { name: 'Dr. Sarah Chen', expertise: ['AI Strategy', 'Ethics'], company: 'Neural Systems', bio: 'Expert in scalable AI ethics and community development.' },
            { name: 'Marcus Vault', expertise: ['Venture Capital', 'Scaling'], company: 'Tech Capital', bio: 'Venture capitalist focusing on local emerging markets.' },
            { name: 'Elena Rodriguez', expertise: ['Global Branding', 'Design'], company: 'Global Sync', bio: 'Architect of some of the world’s most impactful social brands.' }
        ];

        const sponsors = [
            { companyName: 'CyberDyne Systems', contactPerson: 'John Connor', email: 'john@cyberdyne.com', interestLevel: 'High', tier: 'Gold', status: 'In Discussion', estimatedValue: 50000 },
            { companyName: 'Stark Industries', contactPerson: 'Pepper Potts', email: 'pepper@stark.com', interestLevel: 'Signed', tier: 'Gold', status: 'Partner', estimatedValue: 150000 },
            { companyName: 'Wayne Enterprises', contactPerson: 'Lucius Fox', email: 'lucius@wayne.com', interestLevel: 'Medium', tier: 'Silver', status: 'Lead', estimatedValue: 30000 }
        ];

        await Mentor.insertMany(mentors);
        await Sponsor.insertMany(sponsors);

        console.log('Database Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
