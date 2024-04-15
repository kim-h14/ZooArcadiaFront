const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public', 'pages')));

// Serve the home page
app.get('/', (req, res) => {
  // Read the HTML file
  res.sendFile(path.join(__dirname, 'public', 'pages', 'home.html'),'utf8', (err, homeContent) => {
    if (err) {
      res.status(500).send('Error reading home.html');
    } 

    // Read index.html
    fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8', (err, indexContent) => {
      if (err) {
        res.status(500).send('Error reading index.html');
      } 

      // Replace the placeholder with the home content
      const mergedContent = indexContent.replace('<!-- INSERT_HOME_CONTENT -->', homeContent);
      // Send the merged content
      res.send(mergedContent);
    });
  });
});

module.exports = app;
