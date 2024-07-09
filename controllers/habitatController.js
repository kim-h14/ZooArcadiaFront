const { pool } = require('../databases/pgDB');

// Function to get all habitats
const getAllHabitats = async (req, res) => {
  try {
    // Query to select all habitats from the database
    const query = 'SELECT * FROM habitat';

    // Execute the query
    const { rows } = await pool.query(query);

    // Send the fetched data as JSON response
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching habitats:', error);
    res.status(500).json({ error: 'Error fetching habitats' });
  }
};

// Function to create a new habitat
const addHabitat = async (req, res) => {
  const { habitatName, habitatDescription} = req.body;

  try {
     // Insert the new service into the database
     const query = 'INSERT INTO habitat (habitat_name, habitat_description) VALUES ($1, $2)';
     const values = [habitatName, habitatDescription];
     await pool.query(query, values);

    // Respond with a success message
    res.status(201).redirect('/admindashboard');
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'habitat:', error);
    res.status(500).send('Erreur lors de l\'ajout de l\'habitat.');
  }
};

//  Function to update habitat details
const updateHabitat = async (req, res) => {
  const habitatId = req.params.id;
  const { habitatName, habitatDescription } = req.body;

  try {
    // Update the service in the existing table
    await pool.query('UPDATE habitat SET habitat_name = $1, habitat_description = $2 WHERE habitat_id = $3', [habitatName, habitatDescription, habitatId]);
   res.sendStatus(200);
  } catch (error) {
    // Send an error response
    console.error('Error updating habitat:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Function to detele a habitat
const deleteHabitat = async (req, res) => {
  try {
    const habitatId = req.params.id;

    // Delete the habitat from the database
    const query = 'DELETE FROM habitat WHERE habitat_id = $1';
    await pool.query(query, [habitatId]);

    res.status(200).json({ message: 'Habitat deleted successfully' });
  } catch (error) {
    console.error('Error deleting habitat:', error);
    res.status(500).json({ error: 'Error deleting habitat' });
  }
};

// Function to add habitat comment from Vet Dashboard
const addHabitatComment = async (req, res) => {
  try {
    const { username, habitatName, habitatComment, commentDate } = req.body;
    
    // Insert the data into the vetHabitatComment table
    const query = 'INSERT INTO vetHabitatComment (username, habitat_name, vet_comment, date) VALUES ($1, $2, $3, $4)';
    await pool.query(query, [username, habitatName, habitatComment, commentDate]);

    res.status(201).redirect('/vetDashboard');
  } catch (error) {
      console.error('Error adding habitat comment:', error);
      res.status(500).send('Error adding habitat comment.');
  }
};


module.exports = {
  getAllHabitats,
  addHabitat,
  updateHabitat,
  deleteHabitat,
  addHabitatComment
};