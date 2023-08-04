const Client = require("../../models/client.model");
const Moderator = require("../../models/moderator.model");
const User = require("../../models/user.model");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const { ensureLoggedOut, ensureLoggedIn } = require("connect-ensure-login");
const { registerValidator } = require("../../utils/validators");
const { roles } = require("../../utils/constants");


// Controller function for handling user login
const handleLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Handle authentication failure
      req.flash("error", "Invalid credentials");
      return res.redirect("/auth/login");
    }
    // Perform additional role-based actions after successful authentication
    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }
      try {
        // Check the user's role
        if (user.role === roles.moderator) {
          const { email } = req.body;
          const moderatorData = new Moderator({
            email,
            user: user._id,
          });
          await moderatorData.save();
          return res.redirect("/moderator/profile");
        } else {
          return res.redirect("/user/profile");
        }
      } catch (err) {
        console.error("Error saving moderator data:", err);
        return res.redirect("/auth/login");
      }
    });
  })(req, res, next);
};

// Controller function for handling user registration
const handleRegister = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach((error) => {
        req.flash("error", error.msg);
      });
      res.render("register", {
        email: req.body.email,
        messages: req.flash(),
      });
      return;
    }

    const { email, firstName, lastName } = req.body;

    const doesExist = await User.findOne({ email });
    if (doesExist) {
      req.flash("warning", "Username/email already exists");
      res.redirect("/auth/register");
      return;
    }

    const user = new User(req.body);
    user.createdAt = Date.now();
    await user.save();

    if (user.role === roles.client) {
      const client = new Client({
        email,
        user: user._id,
      });
      await client.save();
    } else if (user.role === roles.admin) {
      const admin = new Admin({
        email,
        user: user._id,
      });
      await admin.save();
    }

    req.flash(
      "success",
      `${user.email} registered successfully, you can now login`
    );
    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
};

module.exports = { 
    handleLogin,
    handleRegister 
};
