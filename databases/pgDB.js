const { Pool } = require('pg');
require('dotenv').config();

// Configure the PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
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

