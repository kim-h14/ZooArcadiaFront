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
    const consultations = await animalConsultation.find();
    res.status(200).json(consultations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching animal consultations' });
  }
};

// Function to get like count for a specific animal
const getLikeCount = async (req, res) => {
  const { animal } = req.params;
  try {
    const consultation = await AnimalConsultation.findOne({ animal });
    if (consultation) {
      res.status(200).json({ count: consultation.consultationCount });
    } else {
      res.status(404).json({ error: 'Animal not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching like count' });
  }
};

// Function to increment like count for a specific animal
const incrementLikeCount = async (req, res) => {
  const { animal } = req.params;
  try {
    const consultation = await AnimalConsultation.findOne({ animal });
    if (consultation) {
      consultation.consultationCount += 1;
      await consultation.save();
      res.status(200).json({ count: consultation.consultationCount });
    } else {
      res.status(404).json({ error: 'Animal not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating like count' });
  }
};



module.exports = {
  recordConsultation,
  getAllConsultation,
  getLikeCount,
  incrementLikeCount
};