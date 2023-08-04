const User = require('../../models/user.model');

// Controller function for finding moderators
const findModerators = (req, res) => {
  User.find({ role: "MODERATOR" }, "firstName lastName email", (err, moderators) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.render("findTutor", { moderators });
    }
  });
};

module.exports = { findModerators };
