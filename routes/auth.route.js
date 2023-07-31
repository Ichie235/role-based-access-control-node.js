const router = require("express").Router();
const Client = require("../models/client.model");
const Moderator = require("../models/moderator.model")
const User = require("../models/user.model");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const { ensureLoggedOut, ensureLoggedIn } = require("connect-ensure-login");
const { registerValidator } = require("../utils/validators");
const { roles } = require("../utils/constants");

router.get(
  "/login",
  ensureLoggedOut({ redirectTo: "/" }),
  async (req, res, next) => {
    res.render("login");
  }
);

router.post(
  "/login",
  ensureLoggedOut({ redirectTo: "/" }),
  passport.authenticate("local", {
    successRedirect: "/user/profile",
    //successReturnToOrRedirect: '/user/profile',
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.get(
  "/register",
  ensureLoggedOut({ redirectTo: "/" }),
  async (req, res, next) => {
    res.render("register");
  }
);

router.post(
  "/register",
  ensureLoggedOut({ redirectTo: "/" }),
  registerValidator,
  async (req, res, next) => {
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
      } else if (user.role === roles.moderator) {
        const moderator = new Moderator({
          email,
          user: user._id,
        });
        await moderator.save();
      } else if (user.role === role.admin) {
        const admin = new Admin({
          email,
          user: user._id,
        });
        await admin.save();
      }
      req.flash(
        "success",
        `${user.email} registered succesfully, you can now login`
      );
      res.redirect("/auth/login");
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/logout",
  ensureLoggedIn({ redirectTo: "/" }),
  async (req, res, next) => {
    req.logout();
    res.redirect("/");
  }
);

module.exports = router;
