
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from parent dir if running from scripts/ or current if from root
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Testing MongoDB Connection...');
const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('❌ MONGODB_URI is not defined in .env');
    process.exit(1);
}

console.log(`Target URI: ${uri.split('@')[1] ? '***@' + uri.split('@')[1] : 'Local/Unprotected'}`);

mongoose.connect(uri)
    .then(() => {
        console.log('✅ MongoDB Connection Successful!');
        console.log(`Connected to database: ${mongoose.connection.name}`);
        console.log('Cluster is working and accessible.');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection Failed:', err.message);
        process.exit(1);
    });
