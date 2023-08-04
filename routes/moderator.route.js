const router = require('express').Router();
const accountController = require("../controller/clientController/accountController")
const Moderator = require("../models/moderator.model")
const mongoose = require('mongoose');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You need to sign in to perform this action.");
    res.redirect("/login"); // Redirect to the login page or any other appropriate route
  }
}

router.get('/profile', async (req, res, next) => {
  // console.log(req.user);
  const person = req.user;
  res.render('moderator', { person, Moderator });
});

router.post("/account/personal-details", accountController.updatePersonalDetails);
router.post('/qualifications', isAuthenticated, async (req, res) => {
  const email = req.user.email; 
  console.log(email);
  try {
    const moderator = await Moderator.findOne({ email: email });

    // Update the moderator's qualifications from req.body
    moderator.qualification = req.body.qualification;

    // Uncomment and update other fields if needed
    // moderator.experience = parseInt(req.body.experience);
    // moderator.availability = req.body.availability;
    // moderator.specializations = req.body.specializations;
    // moderator.rate = parseFloat(req.body.rate);
    // moderator.paymentInfo = req.body.paymentInfo;
    // moderator.visibility = req.body.visibility === 'true';

    await moderator.save();
    req.flash("success", "Qualifications updated successfully");
    res.redirect("/moderator/profile");
  }  catch (err) {
    console.error(err);
    req.flash("error", "Internal Server Error");
    res.redirect("/moderator/profile");
  }
});

module.exports = router;
