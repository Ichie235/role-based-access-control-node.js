const router = require("express").Router();
const { ensureLoggedOut, ensureLoggedIn } = require("connect-ensure-login");
const { registerValidator } = require("../utils/validators");
const authController = require("../controller/authController/authentication"); // Adjust the path to your authController.js file

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
  authController.handleLogin
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
  authController.handleRegister
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
