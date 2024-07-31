// Packages required for the application 
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
const { body, validationResult, check } = require('express-validator');
const dotenv = require('dotenv');

// Load environment variables from secret.env
dotenv.config({
  path: path.resolve(__dirname, 'secret.env'),
  allowEmptyValues: true
});

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.error('Stack trace:', err.stack);
  });


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

// // Serve static files from the public directory
app.use(express.static(path.join(__dirname, '/public', '/pages')));

// // Serve static files from the dashbaord directory
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
    res.setHeader('Content-Type', 'application/javascript');
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

// Controllers required for routing and endpoints
const authController = require('./controllers/authController');
const staffController = require('./controllers/staffController');
const serviceController = require('./controllers/serviceController');
const habitatController = require('./controllers/habitatController');
const animalController = require('./controllers/animalController');
const reviewController = require('./controllers/reviewController');
const foodRecordController = require("./controllers/foodRecordController");
const reportController = require('./controllers/reportController');
const consultation = require('./controllers/animalConsultationController');

// Authentification route
app.post('/login', authController.login);

// Staff routes for admin Dashboard
app.get('/accounts', staffController.getAllStaff);
app.post('/create_staff', staffController.addStaff);
app.put('/update_user/:id', staffController.updateStaff);
app.delete('/delete_user/:id', staffController.deleteStaff);
app.get('/vet_names', staffController.getVetNames);
app.get('/employee_names', staffController.getEmployeeNames);


// Service routes for admin and employee Dashboards
app.get('/service', serviceController.getAllServices);
app.post('/add_service', serviceController.addService);
app.put('/updateService/:id', serviceController.updateService);
app.delete('/delete_service/:id', serviceController.deleteService);

// Habitat routes for admin and vet Dashboards
app.get('/habitat', habitatController.getAllHabitats);
app.post('/create_habitat', habitatController.addHabitat);
app.put('/updateHabitat/:id', habitatController.updateHabitat);
app.delete('/delete_habitat/:id', habitatController.deleteHabitat);
app.post('/add_habitat_comment', habitatController.addHabitatComment);


// Animal routes for admin and vet Dashboards
app.get('/animal', animalController.getAllAnimals);
app.post('/create_animal', animalController.addAnimal);
app.put('/update_animal', animalController.updateAnimal);
app.delete('/delete_animal/:id', animalController.deleteAnimal);
app.get('/animal_names', animalController.getAnimalNames);

// Review routes for employee dashboard
app.post('/submit_review', reviewController.submitReview);
app.get('/pending_reviews', reviewController.getPendingReviews);
app.put('/approveReview/:reviewId', reviewController.approveReview);
app.delete('/deleteReview/:reviewId', reviewController.deleteReview);
app.get('/approved_reviews', reviewController.publishReview);

// Food record routes for employee and vet Dashboards
app.get('/vet_food_records', foodRecordController.getAllFoodRecords);

// Sanitization rules for input fields for food records
const sanitizeInput = [
  body('animalName').trim().escape(),
  body('username').trim().escape(),
  body('date').toDate(), // Convert to Date object
  body('foodType').trim().escape(),
  body('foodQuantity').toInt() // Convert to integer
];
app.post('/add_food_record', sanitizeInput, foodRecordController.addFoodRecord);

// Report routes for vet and admindashboards
app.post('/add_animal_report', reportController.addReport);
app.get('/vet_reports', reportController.getAllReports);

// Animal consultation routes for admin dashboard
app.post('/animal-consultations', consultation.recordConsultation);
app.get('/animal-consultations', consultation.getAllConsultation);


// Define a route to serve index.html for all routes

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;