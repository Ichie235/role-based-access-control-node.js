const router = require("express").Router();
const accountController = require("../controller/clientController/accountController");
const { updateVisibility } = require('../controller/moderatorController/updateModeratorVisibility');
const { updateQualifications } = require('../controller/moderatorController/updateQualification');
const Moderator = require("../models/moderator.model");
const Courses = require("../models/courses.model");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You need to sign in to perform this action.");
    res.redirect("/login"); // Redirect to the login page or any other appropriate route
  }
}

router.get("/profile", async (req, res, next) => {
  try {
    const person = req.user;
    // Fetch all moderator data
    const moderators = await Moderator.findOne({ user: req.user }).populate(
      "selectedCourses.course"
    );
    const Course = await Courses.find();
    res.render("moderator", { person, moderators, Course });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post(
  "/account/personal-details",
  accountController.updatePersonalDetails
);

// Use the controller function for updating qualifications
router.post('/qualifications', updateQualifications);

router.put('/mode/:id/visibility', isAuthenticated, updateVisibility);

module.exports = router;
