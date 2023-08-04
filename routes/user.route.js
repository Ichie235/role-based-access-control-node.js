const router = require("express").Router();
const accountController = require("../controller/clientController/accountController")
const courseController = require('../controller/clientController/courseController');
const findModeratorController = require('../controller/clientController/findModeratorsController');


router.get("/profile", async (req, res, next) => {
  const person = req.user;
  res.render("profile", { person });
});

// Define route for finding moderators
router.get("/findModerator", findModeratorController.findModerators);

router.post("/account/personal-details", accountController.updatePersonalDetails);

router.get("/courses", courseController.renderCoursesPage);

// Define the '/courses/send' route
router.post("/courses/send", courseController.handleCourseSelection);

module.exports = router;
