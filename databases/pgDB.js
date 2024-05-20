const { Pool } = require('pg');
require('dotenv').config();

// Configure the PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ARCADIA_back',
    password: 'Arcad!aZo0#',
    port: 5432,
});

// Function to establish database connection
const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL database');
        return client;
    } catch (error) {
        console.error('Error connecting to PostgreSQL database:', error);
        throw error;
    }
};

module.exports = { pool, connectDB };

