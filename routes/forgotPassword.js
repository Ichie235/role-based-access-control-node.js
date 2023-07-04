const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.model')

// Render the forgot password page
router.get('/forgot', (req, res) => {
  res.render('forgot');
});
// Handle the forgot password form submission
router.post('/forgot', async (req, res) => {
    const { email } = req.body;
    console.log(email);
  
    try {
      // Find the user by email (replace this with your database logic)
      const user = await User.findOne({ email });
  
      if (!user) {
        // User not found
        res.render('forgot', { error: 'User not found' });
      } else {
        // Generate a password reset token (replace this with your token generation logic)
        const resetToken = 'abcd1234';
  
        // Store the token and user ID in session
        req.session.resetToken = resetToken;
        req.session.userId = user.id;
        console.log(user.id)
  
        // Redirect to the password reset page
        res.redirect('/passwordReset/reset');
      }
    } catch (error) {
      console.log(error);
      res.render('forgot', { error: 'An error occurred' });
    }
  });
  

// Render the password reset page
router.get('/reset', (req, res) => {
  // Check if a reset token and user ID are stored in session
  if (!req.session.resetToken || !req.session.userId) {
    res.redirect('/passwordReset/forgot');
  } else {
    res.render('reset');
  }
});

// Handle the password reset form submission
router.post('/reset', async (req, res) => {
  const { password, password2 } = req.body;

  // Check if a reset token and user ID are stored in session
  if (!req.session.resetToken || !req.session.userId) {
    res.redirect('/passwordReset/forgot');
    return;
  }

  // Validate password fields
  if (password !== password2) {
    res.render('reset', { error: 'Passwords do not match' });
    return;
  }

  // Find the user by ID (replace this with your database logic)
  const user = await User.findById(req.session.userId);


  if (!user) {
    // User not found
    res.redirect('/passwordReset/forgot');
    return;
  }

  // Hash the new password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Update the user's password (replace this with your database logic)
  user.password = hashedPassword;
  // Save the updated user in the database
   await user.save();
  // Clear the reset token and user ID from session
  delete req.session.resetToken;
  delete req.session.userId;

  // Redirect to login page with a success message
  res.redirect('/auth/login');
});

module.exports = router;
