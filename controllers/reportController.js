const { pool } = require('../databases/pgDB');

// Function for the vet to be able to create a report
const addReport = async (req, res) => {
  try {
    // Extract form data from the request body
    const { animalName, username, animalState, foodType, foodQuantity, reportDate, DetailedAnimalState } = req.body;

    // Insert the report into the database
    const query = `
      INSERT INTO vetreport (animal_name, username, date, animal_state, food_type, food_quantity, detail_animal_state)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const values = [animalName, username, reportDate, animalState, foodType, foodQuantity, DetailedAnimalState];
    await pool.query(query, values);

    // Send a success response
    res.status(201).redirect('/vetDashboard');
  } catch (error) {
    // Handle errors
    console.error('Error adding animal report:', error);
    res.status(500).send('Error adding animal report.');
  }
};

// Function for vet reports to load on admin dashboard
const getAllReports = async (req,res) => {
  try {
    // Query to select all vet reports from the database
    const query = 'SELECT * FROM vetreport';

    // Execute the query
    const { rows } = await pool.query(query);

    // Send the fetched data as JSON response
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching vet reports:', error);
    res.status(500).json({ error: 'Error fetching vet reports' });
  }
};


module.exports = {
  addReport,
  getAllReports
};