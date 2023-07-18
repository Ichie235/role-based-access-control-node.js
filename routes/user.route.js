<<<<<<< HEAD
const router = require('express').Router();
const User = require('../models/user.model')
const Course = require('../models/courses.model')
const bcrypt = require('bcrypt');

router.get('/profile', async (req, res, next) => {
   //console.log(req.user);
  const person = req.user;
  res.render('profile', { person });
});

// Define route for finding moderators
router.get('/findModerator', (req, res) => {
  User.find({ role: 'MODERATOR' }, 'firstName lastName email', (err, moderators) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('findTutor', { moderators });
    }
  });
});

router.post('/account/personal-details', (req, res) => {
  // Retrieve the password, password2, and other fields from the request body
  const { password, password2, town, street, country, postcode } = req.body;

  // Check if the user is logged in
  if (req.user) {
    // Verify that the password and password2 match, if provided
    if (password && password2 && password === password2) {
      // Generate a salt and hash the password
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          req.flash('error', 'Internal Server Error');
          return res.redirect('/user/profile');
        }
        bcrypt.hash(password, salt, (err, hashedPassword) => {
          if (err) {
            req.flash('error', 'Internal Server Error');
            return res.redirect('/user/profile');
          }
          // Update the user's password and other details
          User.findById(req.user.id, (err, user) => {
            if (err) {
              req.flash('error', 'Internal Server Error');
              return res.redirect('/user/profile');
            }
            user.password = hashedPassword;
            user.town = town;
            user.street = street;
            user.country = country;
            user.postcode = postcode;
            user.updatedAt = Date.now();
            user.save((err) => {
              if (err) {
                console.error(err);
                req.flash('error', 'Internal Server Error');
                return res.redirect('/user/profile');
              }
              req.flash('success', 'Profile updated successfully');
              res.redirect('/user/profile');
            });
          });
        });
      });
    } else {
      // Update the user's other details if the password is not provided or does not match
      User.findById(req.user.id, (err, user) => {
        if (err) {
          req.flash('error', 'Internal Server Error');
          return res.redirect('/user/profile');
        }
        user.town = town;
        user.street = street;
        user.country = country;
        user.postcode = postcode;
        user.updatedAt = Date.now();
        user.save((err) => {
          if (err) {
            console.error(err);
            req.flash('error', 'Internal Server Error');
            return res.redirect('/user/profile');
          }
          req.flash('success', 'Profile updated successfully');
          res.redirect('/user/profile');
        });
      });
    }
  } else {
    res.status(401).send('Unauthorized');
  }
});


router.get('/courses', (req, res, next) => {
  Course.find()
  .then((courses) => {
    const user = req.user;
    res.render('courses', { courses, user });
  })
  .catch((error) => {
    res.status(500).json({ error: 'Error retrieving courses' });
  });
});


router.post('/courses/send', (req, res) => {
  const user = req.user; 
  console.log(user)
  const { selectedCourses } = req.body;
  console.log(selectedCourses)

  // Ensure selectedCourses is an array of objects
  const courses = selectedCourses.map(courseId => ({ _id: courseId }));
  // Save the selected courses to the user document in the database
  User.findByIdAndUpdate(
    user._id,
    { selectedCourses: courses },
    { new: true } // Return the updated user document
  )
    .then((updatedUser) => {
      console.log('Course selection saved:', updatedUser);
      res.redirect('/'); // Redirect to the homepage or a confirmation page
    })
    .catch((error) => {
      console.error('Error saving course selection:', error);
      res.redirect('/error'); // Redirect to an error page
    });
});



module.exports = router;
=======
const router = require('express').Router();
const User = require('../models/user.model')

router.get('/profile', async (req, res, next) => {
   //console.log(req.user);
  const person = req.user;
  res.render('profile', { person });
});

// Define route for finding moderators
router.get('/findModerator', (req, res) => {
  User.find({ role: 'MODERATOR' }, 'firstName lastName email', (err, moderators) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('findTutor', { moderators });
    }
  });
});

// Define route for updating user information

module.exports = router;
>>>>>>> a4bd8598d7abf7504cdab1614c408581e0d6bb45
