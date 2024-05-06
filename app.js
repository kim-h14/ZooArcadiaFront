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
    const {email, password, role} = req.body;

    // Insert the new staff member into the database 
    // /!/ DECOMMENT ONCE DATABASE HAS BEEN CREATED ======================
    // const query = 'INSERT INTO staff (email, password, role) VALUES ($1, $2, $3, $4)';

    // await pool.query(query, [email, password, role]);

    res.status(201).send('Nouveau membre du staff ajouté correctement.');
  } catch (error) {
    console.error('Il y a eu une erreur à la création du nouveau membre du staff', error);
    res.status(500).send('Erreur lors de la création du nouveau membre du staff.');
  }
});

// Handle PUT requests to update a staff member for admin Dashboard
app.put('/update_staff', async (req, res) => {

  // /!/ DECOMMENT ONCE DATABASE HAS BEEN CREATED =====================
  // const idStaff = req.params.idStaff;
  const {email, password, current_staff} = req.body;

  try {
    // Update staff member information in the database
        // /!/ DECOMMENT ONCE DATABASE HAS BEEN CREATED ======================
    const result = await pool.query('UPDATE users SET email = $1, password = $2, current_staff = $3',
    [email, password, current_staff]);

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
  const idStaff = req.query.idStaff;

  try{
    // Delete staff member from database
     // /!/ DECOMMENT ONCE DATABASE HAS BEEN CREATED =====================
    // const result = await pool.query('DELETE FROM staff WHERE id_staff = $1', [idStaff]);
    console.log('Successfully deleted staff member with id:', idStaff);
    res.status(200).send('Membre du staff supprimé correctement.');
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
         // /!/ DECOMMENT ONCE DATABASE HAS BEEN CREATED ====================
    // const query = 'INSERT INTO services (name, description, price) VALUES ($1, $2, $3)';

    // await pool.query(query, [name, description, price]);

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
             // /!/ DECOMMENT ONCE DATABASE HAS BEEN CREATED ====================

    // const result = await pool.query(
    //   'UPDATE services SET service_name = $1, service_description = $2 WHERE service_id = $3',
    //   [serviceName, serviceDescription, serviceId]
    // );

    // Check if any rows were affected (service updated successfully)
    console.log('Service updated:', { serviceName, serviceDescription });
    res.status(200).json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Error updating service' });
  }
});

// Handle DELETE requests to delete a service for admin Dashboard
app.delete('/delete_service', async (req, res) => {
  const serviceId = req.query.id;

  try {
      // Delete service from database
      // /!/ DECOMMENT ONCE DATABASE HAS BEEN CREATED =====================
      // const result = await pool.query('DELETE FROM service WHERE id_service = $1', [serviceId]);

      // Check if the service was found and deleted
    console.log('Successfully deleted service member with id:', serviceId);
    res.status(200).send('Membre du service supprimé correctement.');
  } catch (error) {
      console.error('Error deleting service:', error);
      res.status(500).json({ message: 'Error deleting service' });
  }
});



// Handle POST requests to add a new habitat for admin Dashboard
app.post('/create_habitat', async (req, res) => {
  const { habitatName, habitatDescription, habitatAction } = req.body;

  try {
    // Log the submitted data for debugging
    console.log('Submitted habitat data:', { habitatName, habitatDescription, habitatAction });

    // Your logic to handle the form submission goes here
    // This is where you would typically interact with your database or perform any other necessary operations

    // Respond with a success message
    res.status(201).send('Habitat ajouté avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'habitat:', error);
    res.status(500).send('Erreur lors de l\'ajout de l\'habitat.');
  }
});

// Handle PUT requests to update a habitat for admin Dashboard
app.put('/update_habitat', async (req, res) => {
  const habitatId = req.params.id;
  const { habitatName, habitatDescription } = req.body;

  try {
    // Log the submitted data for debugging
    console.log('Submitted habitat data:', { habitatName, habitatDescription });

    // Respond with a success message
    res.status(200).send('Habitat mis à jour avec succès.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'habitat:', error);
    res.status(500).send('Erreur lors de la mise à jour de l\'habitat.');
  }
});

// Handle DELETE requests to delete a habitat for admin Dashboard
app.delete('/delete_habitat', async (req, res) => {
  const habitatId = req.body.habitatId;

  try {
    // Log the submitted data for debugging
    console.log('Submitted habitat ID:', habitatId);

    // Respond with a success message
    res.status(200).send('Habitat supprimé avec succès.');
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'habitat:', error);
    res.status(500).send('Erreur lors de la suppression de l\'habitat.');
  }
});

// Handle POST requests to add a new animal for admin Dashboard
app.post('/create_animal', (req, res) => {
  // Extract data from the request body
  const { animalName, animalSpecies, animalHabitat } = req.body;

// Perform validation
  // /!/ DECOMMENT ONCE DATABASE HAS BEEN CREATED =====================
// if (!animalName || !animalSpecies || !animalHabitat) {
//   // If any required field is missing, respond with an error
//   return res.status(400).send('Please provide all required information.');
// }
// If all validation checks pass, proceed with adding the animal
console.log('New animal details:', { animalName, animalSpecies, animalHabitat });
res.status(200).send('Animal added successfully.');
});

// Handle PUT requests to update an animal for admin Dashboard
app.put('/update_animal', (req, res) => {
  // Extract data from the request body
  const { animalId, animalName, animalSpecies, animalHabitat } = req.body;

  try {
    // Log the submitted data for debugging
    console.log('Submitted animal data:', { animalId, animalName, animalSpecies, animalHabitat });

    // Respond with a success message
    res.status(200).send('Animal mis à jour avec succès.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'animal:', error);
    res.status(500).send('Erreur lors de la mise à jour de l\'animal.');
  }
});

// Handle DELETE  requests to delete an animal for admin Dashboard
app.delete('/delete_animal', (req, res) => {
  // Extract data from the request body
  const { animalId } = req.body;

  try {
    // Log the submitted data for debugging
    console.log('Submitted animal ID:', animalId);

    // Respond with a success message
    res.status(200).send('Animal supprimé avec succès.');
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'animal:', error);
    res.status(500).send('Erreur lors de la suppression de l\'animal.');
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