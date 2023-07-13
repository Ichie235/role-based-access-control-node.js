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
