const { getAdapter } = require('axios');
const { pool } = require('../databases/pgDB');

// Function for clients to submit a review
const submitReview = async (req, res) => {
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
};

// Function to get all pending reviews on employee dashboard
const getPendingReviews = async (req, res) => {
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
};

// Function to approve reviews on employee dashboard
const approveReview = async (req, res) => {
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
};

// Function to reject reviews on employee dashboard
const deleteReview = async (req, res) => {
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
};

// Function to publish approved review on homepage
const publishReview = async (req, res) => {
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
};


module.exports = {
  submitReview,
  getPendingReviews,
  approveReview,
  deleteReview,
  publishReview
};