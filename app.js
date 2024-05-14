const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const { pool, connectDB } = require('./databases/pgDB');


const app = express();
const port = process.env.PORT || 3000;

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

// Define route handler for POST requests to /login
app.post('/login', (req, res) => {
  const { Email, Password } = req.body;

  // TO BE REPLACED WITH ACTUAL VALIDATION WHEN TESTING IS DONE
  if (Email === "test@mail.com" && Password === "Test1234!") {
    // Success
    const token = jwt.sign({ email: Email }, 'secret_key');
    res.redirect("/");
  } else {
    // Invalid credentials
    res.status(401).send('Invalid email or password');
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
app.put('/update_staff', async (req, res) => {
  const { user_id, username, password, role, email } = req.body;

  try {
      // Construct the parameterized SQL query
      let query;
      let values;
      if (password) {
        // If a new password is provided, include it in the update
        query = `
          UPDATE account 
          SET username = $1, password = $2, role = $3, email = $4 
          WHERE user_id = $5
        `;
        values = [username, password, role, email, user_id];
      } else {
        // If no new password is provided, exclude it from the update
        query = `
          UPDATE account 
          SET username = $1, role = $2, email = $3 
          WHERE user_id = $4
        `;
        values = [username, role, email, user_id];
      }

      // Execute the query
      const result = await pool.query(query, values);

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


// Handle PUT requests to update a service for admin & employee Dashboards
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

// Handle DELETE requests to delete a service for admin & employee Dashboards
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
    const query = 'SELECT animal_name, animal_species, habitat_name FROM animal';

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
app.post('/approveReview/:id', async (req, res) => {
  const reviewId = req.params.id;
  try {
      // Update the review in the existing table by setting the approval status to true
      await pool.query('UPDATE review SET approved = true WHERE id = $1', [reviewId]);
      res.sendStatus(200);
  } catch (error) {
      console.error('Error approving review:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Handle POST requests to reject reviews for employee Dashboard
app.post('/reject_review', (req, res) => {
  const reviewID = req.body.reviewID;

  // /!/ UPDATE WHEN DATABASE HAS BEEN IMPLEMENTED
  res.status(200).send('L\'avis a été rejeté avec succès.');
});

// Handle POST requests to add foor record for employee Dashboard
app.post('/add_food_record', async (req, res) => {
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
    // Fetch food consumption records from the database
    const query = 'SELECT date, animal_name, food_type, food_quantity FROM foodrecord';
    const { rows } = await pool.query(query);

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
});

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