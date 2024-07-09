const { pool } = require('../databases/pgDB');

// Function to get all animals
const getAllAnimals = async (req, res) => {
  try {
    // Query to select all animals from the database
    const query = 'SELECT animal_id, animal_name, animal_species, habitat_name FROM animal';

    // Execute the query
    const { rows } = await pool.query(query);

    // Send the fetched data as JSON response
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching animals:', error);
    res.status(500).json({ error: 'Error fetching animals' });
  }
};

// Function to add an animal 
const addAnimal = async (req, res) => {
  try {
    // Extract animal data from the request body
    const { animalName, animalSpecies, animalHabitat } = req.body;

    // Check if the provided habitat exists in the habitat table
    const habitatQuery = 'SELECT habitat_name FROM habitat WHERE habitat_name = $1';
    const habitatResult = await pool.query(habitatQuery, [animalHabitat]);

    if (habitatResult.rows.length === 0) {
      // If the habitat doesn't exist, send an error response
      return res.status(400).json({ error: 'Habitat not found' });
    }

    // Insert the new animal into the database
    const insertQuery = 'INSERT INTO animal (animal_name, animal_species, habitat_name) VALUES ($1, $2, $3)';
    const insertValues = [animalName, animalSpecies, animalHabitat];
    await pool.query(insertQuery, insertValues);

    // Send a success response
    res.status(201).redirect('/admindashboard');
  } catch (error) {
    // Handle errors
    console.error('Erreur lors de l\'ajout de l\'animal:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'animal' });
  }
};

// Function to update info on an animal
const updateAnimal = async (req, res) => {
  try {
    const { animalId, animalName, animalSpecies, animalHabitat } = req.body;

    const updateQuery = 'UPDATE animal SET animal_name = $1, animal_species = $2, habitat_name = $3 WHERE animal_id = $4';
    const updateValues = [animalName, animalSpecies, animalHabitat, animalId];
    await pool.query(updateQuery, updateValues);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating animal:', error);
    res.status(500).json({ error: 'Error updating animal' });
  }
};

// Function to delete an animal 
const deleteAnimal = async (req, res) => {
  try {
    const animalId = req.params.id;

    // Delete the animal from the database
    const query = 'DELETE FROM animal WHERE animal_id = $1';
    await pool.query(query, [animalId]);

    res.status(200).json({ message: 'Animal deleted successfully' });
  } catch (error) {
    console.error('Error deleting animal:', error);
    res.status(500).json({ error: 'Error deleting animal' });
  }
};

// Function to get animal names in dropdowns
const getAnimalNames = async (req, res) => {
  try {
    const query = 'SELECT animal_name FROM animal';
    const { rows } = await pool.query(query);
    const animalNames = rows.map(row => row.animal_name);
    console.log('Animal names:', animalNames); // log animal names
    res.json(animalNames);
  } catch (error) {
    console.error('Error fetching animal names:', error);
    res.status(500).json({ error: 'Error fetching animal names' });
  }
};

module.exports = {
  getAllAnimals,
  addAnimal,
  updateAnimal,
  deleteAnimal,
  getAnimalNames,
};