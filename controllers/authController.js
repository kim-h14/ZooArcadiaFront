const { pool } = require ('../databases/pgDB');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');


dotenv.config();

const saltRounds = 10;

// Cookie setting by role 
const roleCookieName = 'userRole';

function setCookie(res, name, value, days) {
  const options = {
    maxAge: days * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };
  res.cookie(name, value, options);
}

// /Login function to be called by the route handler
const login = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    // Check if the provided credentials match the admin credentials
    if (Email === process.env.ADMIN_EMAIL && Password === process.env.ADMIN_PASSWORD) {
      // Generate JWT token for admin
      const token = jwt.sign({ email: Email, role: 'admin' }, 'your_secret_key');

      // Set role cookie for admin
      setCookie(res, roleCookieName, 'admin', 7);

      // Respond with the token and role
      return res.status(200).json({ token, role: 'admin' });
    }

     // Query the database to find a matching user
     const query = 'SELECT user_id, role, password FROM account WHERE email = $1';
     const result = await pool.query(query, [Email]);
 
     // If a matching user is found
     if (result.rows.length > 0) {
       const user = result.rows[0];
       const hashedPassword = user.password;
 
       // Compare the provided password with the hashed password in the database
       const passwordMatch = await bcrypt.compare(Password, hashedPassword);
 
       if (passwordMatch) {
         // Generate JWT token for user
         const token = jwt.sign({ user_id: user.user_id, email: Email }, 'your_secret_key');
 
         // Set role cookie for user
         let role = user.role;
         if (role === 'Employé') role = 'Employé';
         if (role === 'Vétérinaire') role = 'Vétérinaire';
         setCookie(res, roleCookieName, role, 7);
 
         // Respond with the token and role
         return res.status(200).json({ token, role });
       } else {
         // Password doesn't match, invalid credentials
         return res.status(401).send('Invalid email or password');
       }
     } else {
       // No matching user found, invalid credentials
       return res.status(401).send('Invalid email or password');
     }
   } catch (error) {
     console.error('Error authenticating user:', error);
     return res.status(500).send('Internal Server Error');
   }
};

module.exports = { login };