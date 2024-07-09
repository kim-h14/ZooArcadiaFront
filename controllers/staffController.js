const { pool } = require('../databases/pgDB');

// Function to get all staff members for admin dashboard
const getAllStaff = async (req, res) => {
  try {
    // Query to select all accounts from the database
    const query = 'SELECT * FROM account';

    // Execute the query
    const { rows } = await pool.query(query);

    console.log('Fetched accounts:', rows);

    // Send the fetched data as JSON response
    res.status(200).json(rows);
} catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Error fetching accounts' });
}
};

// Function to add a new staff member on admin dashboard
const addStaff = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if required fields are provided
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Username, email, password, and role are required' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new staff member into the database with the hashed password
    const query = 'INSERT INTO account (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [username, email, hashedPassword, role];
    const result = await pool.query(query, values);

    // Respond with the newly created staff member
    res.send('<script>alert("Le nouvel utilisateur a été créé."); window.location.href = "/admindashboard";</script>');
  } catch (error) {
    console.error('Error creating staff member:', error);
    res.status(500).json({ error: 'Error creating staff member' });
  }
};

// Function to update staff info on admin dashboad

const updateStaff = async (req, res) => {
  try {
    const { userId, username, email, password, role } = req.body;

    let query;
    let values;

    if (password) {
      // Update user with password
      query = 'UPDATE account SET username = $1, email = $2, password = $3, role = $4 WHERE user_id = $5';
      values = [username, email, password, role, userId];
    } else {
      // Update user without changing password
      query = 'UPDATE account SET username = $1, email = $2, role = $3 WHERE user_id = $4';
      values = [username, email, role, userId];
    }

    await pool.query(query, values);

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
};

// Function to delete staff member on admin dashboard
const deleteStaff = async (req, res) => {
  try {
    const userId = req.body.userId;

    // Delete the user from the database
    const query = 'DELETE FROM account WHERE user_id = $1';
    await pool.query(query, [userId]);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};


module.exports = {
  getAllStaff,
  addStaff,
  updateStaff,
  deleteStaff
}