require('dotenv').config();
const mongoose = require('mongoose');
const StaffMember = require('./models/StaffMember');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await StaffMember.deleteMany({});
        console.log('Cleared existing staff');

        // Level 1: Britsync (Main Team)
        const britsync = await StaffMember.create({
            name: 'Britsync Core',
            role: 'Global Operations Control',
            level: 'Britsync',
            location: 'Global Hub',
            department: 'Core',
            order: 1
        });

        // Level 2: Continental Coordinators
        const europeCoord = await StaffMember.create({
            name: 'Elena Volkov',
            role: 'Continental Coordinator',
            level: 'Continental_Coordinator',
            location: 'Europe',
            parent: britsync._id,
            department: 'Strategic',
            order: 2
        });

        const africaCoord = await StaffMember.create({
            name: 'Amara Okafor',
            role: 'Continental Coordinator',
            level: 'Continental_Coordinator',
            location: 'Africa',
            parent: britsync._id,
            department: 'Strategic',
            order: 3
        });

        // Level 3: Regional Coordinators
        const westAfricaCoord = await StaffMember.create({
            name: 'Tunde Bakare',
            role: 'Regional Coordinator',
            level: 'Regional_Coordinator',
            location: 'West Africa',
            parent: africaCoord._id,
            department: 'Operations',
            order: 4
        });

        // Level 4: Ground Team (Volunteers & Uni Leaders)
        await StaffMember.create({
            name: 'Lagos Uni Node',
            role: 'University Leader',
            level: 'Ground_Team',
            location: 'Lagos, Nigeria',
            parent: westAfricaCoord._id,
            department: 'Ground',
            order: 5
        });

        console.log('Database seeded successfully with refined hierarchy');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
