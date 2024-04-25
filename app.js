const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Debugging middleware to log requested URLs
app.use((req, res, next) => {
  console.log('Requested URL:', req.url);
  next();
});

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '/public')));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '/public', '/pages')));

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

// // Define a route for the home page
// app.get('/', (req, res) => {
//   // Read the content of home.html
//   fs.readFile(path.join(__dirname, '/public', '/pages', '/home.html'), 'utf8', (err, homeContent) => {
//     if (err) {
//       return res.status(500).send('Error reading home.html');
//     }

//     // Read the content of index.html
//     fs.readFile(path.join(__dirname, '/public','/index.html'), 'utf8', (err, indexContent) => {
//       if (err) {
//         return res.status(500).send('Error reading index.html');
//       }

//       // Merge the content of home.html with index.html
//       const mergedContent = indexContent.replace('<!-- INSERT_HOME_CONTENT -->', homeContent);

//       // Send the merged content in the response
//       res.send(mergedContent);
//     });
//   });
// });

// Define a route for the animals page
// app.get('/animals', (req, res) => {
//   // Read the content of animals.html
//   fs.readFile(path.join(__dirname, '/public', '/pages', '/animals.html'), 'utf8', (err, animalsContent) => {
//     if (err) {
//       return res.status(500).send('Error reading animals.html');
//     }

//     // Read the content of index.html
//     fs.readFile(path.join(__dirname, '/public','/index.html'), 'utf8', (err, indexContent) => {
//       if (err) {
//         return res.status(500).send('Error reading index.html');
//       }

//       // Merge the content of animals.html with index.html
//       const mergedContent = indexContent.replace('<!-- INSERT_HOME_CONTENT -->', animalsContent);

//       // Send the merged content in the response
//       res.send(mergedContent);
//     });
//   });
// });



module.exports = app;