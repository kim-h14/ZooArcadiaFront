const { pool } = require('../databases/pgDB');

// Function to display the food records on Vet dashboard
const getAllFoodRecords = async (req, res) => {
  try {
    const animalName = req.query.animal;
    let query = 'SELECT date, animal_name, food_type, food_quantity FROM foodrecord';
    const queryParams = [];

    if (animalName) {
      query += ' WHERE animal_name = $1';
      queryParams.push(animalName);
    }

    const { rows } = await pool.query(query, queryParams);

    // Send the fetched records as JSON response
    res.json(rows);
  } catch (error) {
    // Handle errors
    console.error('Error fetching food records:', error);
    res.status(500).json({ error: 'Error fetching food records' });
  }
};

// Function for the employee to log a food record 

const addFoodRecord = async (req, res) => {
  const { animalName, foodType, foodQuantity, username, date } = req.body;
  try {
    const query = 'INSERT INTO foodrecord (animal_name, username, date, food_type, food_quantity) VALUES ($1, $2, $3, $4, $5)';
    const values = [animalName, username, date, foodType, foodQuantity];
    await pool.query(query, values);

    res.status(201).redirect('/employeeDashboard');
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'enregistrement alimentaire:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'enregistrement alimentaire' });
  }
};

module.exports = {
  getAllFoodRecords,
  addFoodRecord
};