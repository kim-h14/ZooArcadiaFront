const pg = require('pg');

require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD;

// Function to establish connectio to the database

function connectDB(callback) {
  const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'arcadia',
    password: dbPassword,
    port: 5432,
  });

db.connect((err) => {
  if (err) {
    // If error connecting to the database, log the error to the console
    console.error('Error connecting to the database');
    callback(err, null);
  } else {
    console.log('Connected to the database');
    callback(null, db);
  }
});
}

module.exports = connectDB();
