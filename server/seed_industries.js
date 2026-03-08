require('dotenv').config();
const mongoose = require('mongoose');
const StaffMember = require('./models/StaffMember');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gaio';

const sampleIndustries = [
    {
        title: "Energy & Grid Systems",
        info: "Optimizing renewable energy distribution through neural load forecasting and smart grid integration.",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=400"
    },
    {
        title: "Financial Intelligence",
        info: "Developing next-gen algorithmic trading protocols and decentralized risk assessment models.",
        image: "https://images.unsplash.com/photo-1611974708434-92437651030e?auto=format&fit=crop&q=80&w=400"
    },
    {
        title: "Automated Logistics",
        info: "Synchronizing global supply chains using real-time predictive analytics and autonomous routing.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400"
    },
    {
        title: "Health Diagnostics",
        info: "Advancing medical research through large-scale genomic sequencing and automated diagnostic layers.",
        image: "https://images.unsplash.com/photo-1576091160550-2173599bd14e?auto=format&fit=crop&q=80&w=400"
    }
];

async function seedIndustries() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const staff = await StaffMember.find({});
        console.log(`Found ${staff.length} staff members`);

        for (const member of staff) {
            // Assign 2 random industries to each member if they have none
            if (!member.industries || member.industries.length === 0) {
                const shuffled = [...sampleIndustries].sort(() => 0.5 - Math.random());
                member.industries = shuffled.slice(0, 2);
                await member.save();
                console.log(`Updated ${member.name} with sample industries`);
            }
        }

        console.log('Seeding complete');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seedIndustries();
