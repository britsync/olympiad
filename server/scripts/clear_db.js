const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/olympiad')
    .then(async () => {
        console.log('Connected to MongoDB');

        try {
            await mongoose.connection.collection('participants').deleteMany({});
            console.log('Cleared Participants');

            await mongoose.connection.collection('submissions').deleteMany({});
            console.log('Cleared Submissions');

            console.log('Database cleanup complete.');
        } catch (error) {
            console.error('Error clearing database:', error);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
