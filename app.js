const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const { pool, connectDB } = require('./databases/pgDB');
const AnimalConsultation = require('./databases/animalConsultation'); 
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');


const app = express();
const port = process.env.PORT || 3000;
const saltRound = 10;

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/arcardia-consultation')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


//Parse JSON bodies 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


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

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Save uploaded files to the 'uploads' directory
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    // Set the filename to be unique
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });

// Call connectDB function to establish database connection
connectDB()
  .then(() => {
    // Database connection successful, continue with defining routes
    console.log('Database connection successful');
    
    // Define route to check database connection
    app.get('/check-db-connection', (req, res) => {
      res.status(200).send('Database connection successful');
    });
  })
  .catch((error) => {
    // Database connection failed, log the error
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Exit the application with a non-zero exit code
  });

// Route to check database connection
app.get('/check-db-connection', async (req, res) => {
  try {
      // Attempt to connect to the database
      await connectDB();
      // If successful, send a success response
      res.status(200).send('Database connection successful');
  } catch (error) {
      // If there's an error, send an error response
      console.error('Error connecting to the database:', error);
      res.status(500).send('Error connecting to the database');
  }
});

function setCookie(res, name, value, days) {
  const options = {
    maxAge: days * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };
  res.cookie(name, value, options);
}
const roleCookieName = 'userRole';

// Define route handler for POST requests to /login
app.post('/login', async (req, res) => {
  const { Email, Password } = req.body;

  try {
    // Check if the provided credentials match the admin credentials
    if (Email === process.env.ADMIN_EMAIL && Password === process.env.ADMIN_PASSWORD) {
      // Generate JWT token for admin
      const token = jwt.sign({ email: Email, role: 'admin' }, 'your_secret_key');

      // Set role cookie for admin
      setCookie(res, roleCookieName, 'admin', 7);

      // Respond with the token and role
      return res.status(200).json({ token, role: 'admin' });
    }

    // Query the database to find a matching user
    const query = 'SELECT user_id, role FROM account WHERE email = $1 AND password = $2';
    const result = await pool.query(query, [Email, Password]);

    // If a matching user is found
    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Generate JWT token for user
      const token = jwt.sign({ user_id: user.user_id, email: Email }, 'your_secret_key');

      // Set role cookie for user
      let role = user.role;
      if (role === 'Employé') role = 'Employé';
      if (role === 'Vétérinaire') role = 'Vétérinaire';
      setCookie(res, roleCookieName, role, 7);

      // Respond with the token and role
      return res.status(200).json({ token, role });
    } else {
      // No matching user found, invalid credentials
      return res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(500).send('Internal Server Error');
  }
});


// Handle POST requests to create a new staff member for admin Dashboard
app.post('/create_staff', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if required fields are provided
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Username, email, password, and role are required' });
    }

    // Insert the new staff member into the database 
    const query = 'INSERT INTO account (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [username, email, password, role];
    const result = await pool.query(query, values);

    // Respond with the newly created staff member
    // res.status(201).json({ message: 'Le nouvel utilisateur a été créé.', data: result.rows[0] });
    res.send('<script>alert("Le nouvel utilisateur a été créé."); window.location.href = "/admindashboard";</script>');
  } catch (error) {
    console.error('Error creating staff member:', error);
    res.status(500).json({ error: 'Error creating staff member' });
  }
});

// Handle GET requests to fetch all staff members for admin Dashboard
app.get('/accounts', async (req, res) => {
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
});

// Handle PUT requests to update a staff member for admin Dashboard
app.put('/update_user', async (req, res) => {
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
});

// Handle DELETE requests to delete a staff member for admin Dashboard
app.delete('/delete_user', async (req, res) => {
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
});

// Handle POST requests to add a new service for admin Dashboard
app.post('/add_service', async (req, res) => {
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
});

// Handle GET requests to fetch all services for admin & employee Dashboards
app.get('/service', async (req, res) => {
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
});


// Handle PUT requests to update a service for admin Dashboards
app.put('/updateService/:id', async (req, res) => {
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
});

// Handle DELETE requests to delete a service for admin Dashboards
app.delete('/delete_service/:id', async (req, res) => {
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
});

// Handle POST requests to add a new habitat for admin Dashboard
app.post('/create_habitat', async (req, res) => {
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
});

// Handle GET requests to fetch all habitats for admin Dashboard
app.get('/habitat', async (req, res) => {
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
});

// Handle PUT requests to update a habitat for admin Dashboard
app.put('/updateHabitat/:id', async (req, res) => {
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
});

// Handle DELETE requests to delete a habitat for admin Dashboard
app.delete('/delete_habitat/:id', async (req, res) => {
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
});

// Handle POST requests to add a new animal for admin Dashboard
app.post('/create_animal', async (req, res) => {
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
});

// Handle GET requests to fetch all animals for admin Dashboard
app.get('/animal', async (req, res) => {
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
});


// Handle PUT requests to update an animal for admin Dashboard
app.put('/update_animal', async (req, res) => {
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
});

// Handle DELETE  requests to delete an animal for admin Dashboard
app.delete('/delete_animal/:id', async (req, res) => {
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
});

// Handle GET requests to fetch the vet reports
app.get('/vet_reports', async (req, res) => {
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
});

// Handle GET requests to fetch veterinarian names
app.get('/vet_names', async (req, res) => {
  try {
    const query = 'SELECT username AS name FROM account WHERE role = $1';
    const result = await pool.query(query, ['Vétérinaire']);
    
    // Check if the result is an array and map it properly
    if (result.rows.length > 0) {
      const veterinarians = result.rows.map(row => ({ name: row.name }));
      res.status(200).json(veterinarians);
    } else {
      res.status(404).json({ error: 'No veterinarians found' });
    }
  } catch (error) {
    console.error('Error fetching veterinarian names:', error);
    res.status(500).json({ error: 'Error fetching veterinarian names' });
  }
});


// Handle POST requests to submit a new review to the employee Dashboard
app.post('/submit_review', async (req, res) => {
  try {

    console.log(req.body);

    // Extract review data from the request body
    const { clientName, messageReview, cityReview, emailReview } = req.body;

    // Insert the review into the database
    const query = 'INSERT INTO review (client_name, review_text, city, email) VALUES ($1, $2, $3, $4)';
    const values = [clientName, messageReview, cityReview, emailReview];
    await pool.query(query, values);

    // Send a success response
    res.status(201).redirect('/');
  } catch (error) {
    // Handle errors
    console.error('Error submitting review:', error);
    res.status(500).send('Error submitting review.');
  }
});

// Handle GET requests to receive pending reviews for employee Dashboard
app.get('/pending_reviews', async (req, res) => {
  try {
    // Query the database to retrieve pending reviews data
    const query = 'SELECT client_name, city, email, review_text, review_id FROM review WHERE review_approved IS NULL';
    const { rows } = await pool.query(query);

    // Send the retrieved data as a JSON response
    res.status(200).json(rows);
  } catch (error) {
    // Handle errors
    console.error('Error fetching pending reviews:', error);
    res.status(500).json({ error: 'Error fetching pending reviews' });
  }
});

// Handle POST requests to approve reviews for employee Dashboard
app.put('/approveReview', async (req, res) => {
  // Extract review ID from the request body
  const reviewId = req.body.id;
  try {
    // Update the review in the existing table by setting the approval status to true
    await pool.query('UPDATE review SET review_approved = true WHERE review_id = $1', [reviewId]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle DELETE requests to reject reviews for employee Dashboard
app.delete('/deleteReview/:reviewId', async (req, res) => {
  // Extract review ID from the URL parameter
  const reviewId = req.params.reviewId;

  console.log('Received delete request for review ID:', reviewId); // Log the review ID

  try {
    // Delete the review from the database
    await pool.query('DELETE FROM review WHERE review_id = $1', [reviewId]);
    res.sendStatus(200); // Send a success response
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).send('Internal Server Error'); // Send an error response
  }
});

// Handle PUT requests to update a service for employee Dashboards
app.put('/employee/updateService/:id', async (req, res) => {
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
});

// Handle DELETE requests to delete a service
app.delete('/delete_service/:id', async (req, res) => {
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
});

// Handle POST requests to add foor record for employee Dashboard
// Sanitization rules for input fields
const sanitizeInput = [
  body('animalName').trim().escape(),
  body('username').trim().escape(),
  body('date').toDate(), // Convert to Date object
  body('foodType').trim().escape(),
  body('foodQuantity').toInt() // Convert to integer
];

app.post('/add_food_record', sanitizeInput, async (req, res) => {
  try {
    // Extract food consumption record data from the request body
    const { animalName, foodType, foodQuantity, username, date } = req.body;

    // UNCOMMENT AFTER HANDLING AUTHENTIFICATION PER USER ===============================
    // Extract the username from the authenticated user 
    // const username = req.user.username;

    // Insert the new food consumption record into the database
    // WILL NEED TO ADD THE USERNAME TO THE QUERRY ===============================
    const query = 'INSERT INTO foodrecord (animal_name, username, date,food_type, food_quantity) VALUES ($1, $2, $3, $4, $5)';
    const values = [animalName, username, date, foodType, foodQuantity,];
    await pool.query(query, values);

    // Send a success response
    res.status(201).redirect('/employeeDashboard');
  } catch (error) {
    // Handle errors
    console.error('Erreur lors de l\'ajout de l\'enregistrement alimentaire:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'enregistrement alimentaire' });
  }
});

// Handle POST request to add report on animals for vet Dashboard
app.post('/add_animal_report', async (req, res) => {
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
});

// Handle GET requests to fetch food records for vet Dashboard
app.get('/vet_food_records', async (req, res) => {
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
});

// Handle GET requests to fetch animal names from the server and populate the drop down list in food records for vet Dashboard
app.get('/animal_names', async (req, res) => {
  try {
    const query = 'SELECT animal_name FROM animal';
    const { rows } = await pool.query(query);
    const animalNames = rows.map(row => row.animal_name);
    console.log('Animal names:', animalNames); // Add this line to log animal names
    res.json(animalNames);
  } catch (error) {
    console.error('Error fetching animal names:', error);
    res.status(500).json({ error: 'Error fetching animal names' });
  }
});


// Handle POST request to add a comment on habitat for vet Dashboard
app.post('/add_habitat_comment', async (req, res) => {
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
}
);


// Handle GET requests to fetch reviews from the database to appear on the homepage on loop
app.get('/approved_reviews', async (req, res) => {
  try {
      // Query to select approved reviews from the database
      const query = 'SELECT * FROM review WHERE review_approved = true';

      // Execute the query
      const { rows } = await pool.query(query);

      // Send the fetched data as JSON response
      res.status(200).json(rows);
  } catch (error) {
      console.error('Error fetching approved reviews:', error);
      res.status(500).json({ error: 'Error fetching approved reviews' });
  }
});

// Handle POST requests for animal consultations
app.post('/animal-consultations', async (req, res) => {
  try {
    const { animal } = req.body;
    // Find the document corresponding to the animal
    const consultation = await AnimalConsultation.findOne({ animal });
    if (consultation) {
      // If the document exists, increment the consultation count
      consultation.consultationCount += 1;
      await consultation.save();
      console.log('Updated consultation:', consultation);
      res.status(200).json(consultation);
    } else {
      // If the document doesn't exist, create a new one with the initial count
      const newConsultation = new AnimalConsultation({
        animal,
        consultationCount: 1
      });
      const savedConsultation = await newConsultation.save();
      console.log('Saved consultation:', savedConsultation);
      res.status(201).json(savedConsultation);
    }
  } catch (error) {
    console.error('Error registering consultation:', error);
    res.status(500).json({ error: 'Error registering consultation' });
  }
});

// Handle GET requests to fetch animal consultation data
app.get('/animal-consultations', async (req, res) => {
  try {
    // Fetch all documents from the AnimalConsultation collection
    const consultations = await AnimalConsultation.find();

    // Send the consultations data as a JSON response
    res.status(200).json(consultations);
  } catch (error) {
    console.error('Error fetching animal consultations:', error);
    res.status(500).json({ error: 'Error fetching animal consultations' });
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