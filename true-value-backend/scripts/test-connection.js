const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testConnection = async () => {
    const uri = process.env.MONGO_URI;
    console.log('Attempting to connect to MongoDB...');
    console.log('URI:', uri.replace(/:([^@:]+)@/, ':****@')); // Hide password

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ MongoDB Connected successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        if (error.message.includes('ECONNREFUSED') && error.message.includes('_mongodb._tcp')) {
            console.log('\n--- DIAGNOSIS ---');
            console.log('This is a DNS SRV resolution issue.');
            console.log('Recommended Fix: Change your system DNS to 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare).');
        }
        process.exit(1);
    }
};

testConnection();
