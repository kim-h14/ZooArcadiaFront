const { MongoClient } = require('mongodb');

// MongoDB connection URI for local installation
const uri = 'mongodb://localhost:27017';

// MongoDB client
let client;

// Function to establish database connection
const connectMongo = async () => {
    try {
        // Create a new MongoDB client if not already created
        if (!client) {
            client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            console.log('Connected to MongoDB database');
        }
        return client;
    } catch (error) {
        console.error('Error connecting to MongoDB database:', error);
        throw error;
    }
};

module.exports = { connectMongo };
