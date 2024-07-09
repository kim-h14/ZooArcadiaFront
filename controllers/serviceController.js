const { pool } = require('../databases/pgDB');

// Function to get all services
const getAllServices = async (req, res) => {
  try {
    // Query to select all services from the database
    const query = 'SELECT * FROM service';

    // Execute the query
    const { rows } = await pool.query(query);

    // Send the fetched data as JSON response
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Error fetching services' });
  }
};

// Function to add a service
const addService = async (req, res) => {
  try {
    // Extract service data from the request body
    const { serviceName, serviceDescription } = req.body;

    // Insert the new service into the database
    const query = 'INSERT INTO service (service_name, service_description) VALUES ($1, $2)';
    const values = [serviceName, serviceDescription];
    await pool.query(query, values);

    // Send a success response
    res.status(201).redirect('/admindashboard');
  } catch (error) {
    // Handle errors
    console.error('Erreur lors de l\'ajout du service:', error);
    res.status(500).send('Erreur lors de l\'ajout du service.');
  }
};

// Function to update services
const updateService = async (req, res) => {
  const serviceId = req.params.id;
  const { serviceName, serviceDescription } = req.body;

  try {
    // Update the service in the existing table
    await pool.query('UPDATE service SET service_name = $1, service_description = $2 WHERE service_id = $3', [serviceName, serviceDescription, serviceId]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Function to delete a service
const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;

    // Delete the service from the database
    const query = 'DELETE FROM service WHERE service_id = $1';
    await pool.query(query, [serviceId]);

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Error deleting service' });
  }
};


module.exports = {
  getAllServices,
  addService,
  updateService,
  deleteService
};