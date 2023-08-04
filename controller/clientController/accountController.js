const bcrypt = require('bcrypt');
const User = require('../../models/user.model'); 

// Controller function for updating user personal details
const updatePersonalDetails = (req, res) => {
  const { password, password2, town, street, country, postcode } = req.body;

  if (req.user) {
    if (password && password2 && password === password2) {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          req.flash("error", "Internal Server Error");
          return res.redirect("/user/profile");
        }
        bcrypt.hash(password, salt, (err, hashedPassword) => {
          if (err) {
            req.flash("error", "Internal Server Error");
            return res.redirect("/user/profile");
          }
          updateDetails(req, res, hashedPassword, town, street, country, postcode);
        });
      });
    } else {
      updateDetails(req, res, null, town, street, country, postcode);
    }
  } else {
    res.status(401).send("Unauthorized");
  }
};

// Helper function to update user details
const updateDetails = (req, res, hashedPassword, town, street, country, postcode) => {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      req.flash("error", "Internal Server Error");
      return res.redirect("/user/profile");
    }
    if (hashedPassword) {
      user.password = hashedPassword;
    }
    user.town = town;
    user.street = street;
    user.country = country;
    user.postcode = postcode;
    user.updatedAt = Date.now();

    user.save((err) => {
      if (err) {
        console.error(err);
        req.flash("error", "Internal Server Error");
        return res.redirect("/user/profile");
      }
      req.flash("success", "Profile updated successfully");
      res.redirect("/user/profile");
    });
  });
};

module.exports = { updatePersonalDetails };
