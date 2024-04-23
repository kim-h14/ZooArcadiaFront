const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '/public')));

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

// Define a route for the home page
app.get('/', (req, res) => {
  // Read the content of home.html
  fs.readFile(path.join(__dirname, '/public', '/pages', '/home.html'), 'utf8', (err, homeContent) => {
    if (err) {
      return res.status(500).send('Error reading home.html');
    }

    // Read the content of index.html
    fs.readFile(path.join(__dirname, '/public','/index.html'), 'utf8', (err, indexContent) => {
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