const { get } = require('jquery');
const animalConsultation = require('../databases/animalConsultation');

// Function to record all animal consultations
const recordConsultation = async (req, res) => {
  try {
    const { animal } = req.body;
    // Find the document corresponding to the animal
    const consultation = await animalConsultation.findOne({ animal });
    if (consultation) {
      // If the document exists, increment the consultation count
      consultation.consultationCount += 1;
      await consultation.save();
      console.log('Updated consultation:', consultation);
      res.status(200).json(consultation);
    } else {
      // If the document doesn't exist, create a new one with the initial count
      const newConsultation = new animalConsultation({
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
};

// Function to display animal consultation data on admin dashboard
const getAllConsultation = async (req, res) => {
  try {
    // Fetch all documents from the AnimalConsultation collection
    const consultations = await animalConsultation.find();

    // Send the consultations data as a JSON response
    res.status(200).json(consultations);
  } catch (error) {
    console.error('Error fetching animal consultations:', error);
    res.status(500).json({ error: 'Error fetching animal consultations' });
  }
};


module.exports = {
  recordConsultation,
  getAllConsultation
};