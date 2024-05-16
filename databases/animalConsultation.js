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



// Create a new document
// const newAnimalConsultation = new animalConsultation({
//   animal: 'Dog',
//   consultationCount: 2
// });

// // Save the document to the database
// newAnimalConsultation.save()
//   .then(savedDocument => {
//     console.log('New document saved:', savedDocument);
    
//     // Query all documents in the collection
//     return animalConsultation.find({});
//   })
//   .then(allDocuments => {
//     console.log('All documents:', allDocuments);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
