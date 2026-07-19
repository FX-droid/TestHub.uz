const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function connectDB() {
    const uri = process.env.MONGODB_URI;
    try {
        console.log(`Connecting to MongoDB at: ${uri}...`);
        // Try to connect to normal URI first (short timeout: 3 seconds)
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
        console.log('✅ MongoDB Connected.');
    } catch (err) {
        console.warn(`⚠️  Local connection failed (${err.message}). Starting In-Memory MongoDB...`);
        try {
            mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri() + 'testhub';
            console.log(`🚀 In-Memory MongoDB started at: ${mongoUri}`);
            await mongoose.connect(mongoUri);
            console.log('✅ Connected to In-Memory MongoDB');

            // Store in process.env for subsequent processes
            process.env.MONGODB_URI = mongoUri;
        } catch (memError) {
            console.error('❌ Failed to start In-Memory MongoDB Server:', memError.message);
            process.exit(1);
        }
    }
}

async function closeDB() {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
}

module.exports = { connectDB, closeDB };
