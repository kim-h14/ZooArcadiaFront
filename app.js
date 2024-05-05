const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
// Load environment variables from .env file for sensitive data
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Debugging middleware to log requested URLs
app.use((req, res, next) => {
  console.log('Requested URL:', req.url);
  next();
});

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '/public')));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '/public', '/pages')));

// Serve static files from the dashbaord directory
app.use(express.static(path.join(__dirname, '/public', '/dashboards')));

// Serve static files from the node_modules directory
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Serve static files from the assets directory
app.use('/Assets', express.static(path.join(__dirname, 'assets')));

// Serve static files from the scss directory
app.use('/scss', express.static(path.join(__dirname, 'scss')));

// Set the correct MIME type for CSS files
app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  next();
});

// Set MIME type for JavaScript files
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'text/javascript');
  }
  next();
});

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure the PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'arcadia',
    password: process.env.DB_PASSWORD,
    port: 5432, 
});

// Handle POST requests to create a new staff member for admin Dashboard
app.post('/create_staff', async (req, res) => {
  try {
    const {username, email, password, role} = req.body;

    // Insert the new staff member into the database
    const query = 'INSERT INTO staff (username, email, password, role) VALUES ($1, $2, $3, $4)';

    await pool.query(query, [username, email, password, role]);

    res.status(201).send('Nouveau membre du staff ajouté correctement.');
  } catch (error) {
    console.error('Il y a eu une erreur à la création du nouveau membre du staff', error);
    res.status(500).send('Erreur lors de la création du nouveau membre du staff.');
  }
});

// Handle PUT requests to update a staff member for admin Dashboard
app.put('/update_staff', async (req, res) => {
  const idStaff = req.params.idStaff;
  const {email, password, current_staff} = req.body;

  try {
    // Update staff member information in the database
    const result = await pool.query('UPDATE users SET email = $1, password = $2, current_staff = $3 WHERE id_staff = $4',
    [email, password, current_staff, userId]);

    // Check if the staff member was found and updated
    if (result.rowCount === 1) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Handle DELETE requests to delete a staff member for admin Dashboard
app.delete('/delete_staff', async (req, res) => {
  const idStaff = req.params.idStaff;

  try{
    // Delete staff member from database
    const result = await pool.query('DELETE FROM staff WHERE id_staff = $1', [idStaff]);

    if (result.rowCount === 1){
      res.status(200).send('Membre du staff supprimé correctement.');
    } else {
      res.status(404).send('Membre du staff non trouvé.');
    }
  } catch (error) {
    console.error('Il y a eu une erreur lors de la suppression du membre du staff.', error);
    res.status(500).send('Erreur lors de la suppression du membre du staff.');
  }
});

// Handle POST requests to add a new service for admin Dashboard
app.post('/add_service', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Insert the new service into the database
    const query = 'INSERT INTO services (name, description, price) VALUES ($1, $2, $3)';

    await pool.query(query, [name, description, price]);

    res.status(201).send('Nouveau service ajouté correctement.');
  } catch (error) {
    console.error('Il y a eu une erreur lors de l\'ajout du service.', error);
    res.status(500).send('Erreur lors de l\'ajout du service.');
  }
});

// Handle PUT requests to update a service for admin Dashboard
app.put('/update_service', async (req, res) => {
  const idService = req.params.id;
  const {serviceName, serviceDescription} = req.body;

  try {
    // Update the service information inside the database
    const result = await pool.query(
      'UPDATE services SET service_name = $1, service_description = $2 WHERE service_id = $3',
      [serviceName, serviceDescription, serviceId]
    );
    // Check if any rows were affected (service updated successfully)
    if (result.rowCount === 1) {
      res.status(200).json({ message: 'Service updated successfully' });
    } else {
      res.status(404).json({ message: 'Service not found' });
  }
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Error updating service' });
  }
});


// Define a route to serve index.html for all routes
app.get('*', (req, res) => {
  // Read the content of index.html
  fs.readFile(path.join(__dirname, '/public', '/index.html'), 'utf8', (err, indexContent) => {
    if (err) {
      return res.status(500).send('Error reading index.html');
    }

    // Send index.html as response for all routes
    res.send(indexContent);
  });
});

module.exports = app;