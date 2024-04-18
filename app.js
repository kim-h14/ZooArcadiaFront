const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, 'public', 'pages')));

// Define a route for the home page
app.get('/', (req, res) => {
  // Read the content of home.html
  fs.readFile(path.join(__dirname, 'public', 'pages', 'home.html'), 'utf8', (err, homeContent) => {
    if (err) {
      return res.status(500).send('Error reading home.html');
    }

    // Read the content of index.html
    fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8', (err, indexContent) => {
      if (err) {
        return res.status(500).send('Error reading index.html');
      }

      // Merge the content of home.html with index.html
      const mergedContent = indexContent.replace('<!-- INSERT_HOME_CONTENT -->', homeContent);

      // Send the merged content in the response
      res.send(mergedContent);
    });
  });
});

module.exports = app;
