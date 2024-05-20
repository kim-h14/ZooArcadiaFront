const mongoose = require('mongoose');

const animalConsultationSchema = new mongoose.Schema({
  animal: {
    type: String,
    required: true,
    unique: true
  },
  consultationCount: {
    type: Number,
    default: 0
  }
});

const AnimalConsultation = mongoose.model('animalConsultation', animalConsultationSchema);

module.exports = AnimalConsultation;

