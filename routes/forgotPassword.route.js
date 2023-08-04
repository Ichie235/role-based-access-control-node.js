const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const crypto = require("crypto");
const User = require("../models/user.model");
// const Token = require("../models/Token");
// const sendEmail = require("../utils/sendEmail");
const forgotPasswordController = require('../controller/forgotPasswordController/passwordReset'); 

require("dotenv").config();

// Render the forgot password page
router.get("/forgot", (req, res) => {
  res.render("forgot");
});
// Handle the forgot password form submission
// router.post("/forgot", async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       // User not found
//       res.render("forgot", { error: "User not found" });
//       return;
//     }

//     let token = await Token.findOne({ userId: user._id });
//     if (!token) {
//       token = await new Token({
//         userId: user._id,
//         token: crypto.randomBytes(32).toString("hex"),
//       }).save();
//     }
//     //user ID in session
//     req.session.userId = user.id;
//     console.log(user.id);
//     const link = `${process.env.BASE_URL}/passwordReset/${user._id}/${token.token}`;
//     await sendEmail(user.email, "Password reset", link);
    
//   // Redirect to the password reset page with a success message
//   res.render("forgot", { successMessage: "Check your email for the reset link" });

//   } catch (error) {
//     console.log(error);
//     res.render("forgot", { error: "An error occurred" });
//   }
// });


router.post("/forgot", forgotPasswordController.handleForgotPassword);


// Render the password reset page
router.get("/:userId/:token", (req, res) => {
  if (!req.session.userId) {
    res.redirect("/passwordReset/forgot");
  } else {
    res.render("reset");
  }
});

// Handle the password reset form submission
// router.post("/:userId/:token", async (req, res) => {
//   const { password, password2 } = req.body;

//   // Check if a reset token and user ID are stored in session
//   if (!req.session.userId) {
//     res.redirect("/passwordReset/forgot");
//     return;
//   }
//   try {
//     // Validate password fields
//     if (password !== password2) {
//       res.render("reset", { error: "Passwords do not match" });
//       return;
//     }
//     // Find the user by ID (replace this with your database logic)
//     const user = await User.findById(req.session.userId);

//     if (!user) {
//       // User not found
//       res.redirect("/passwordReset/forgot");
//       return;
//     }
//     // Hash the new password
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     // Update the user's password
//     user.password = hashedPassword;

//     // Save the updated user in the database
//     await user.save();

//     // Redirect to login page with a success message
//     res.redirect("/auth/login");
//   } catch (error) {
//     console.log(error);
//     res.redirect("/passwordReset/forgot");
//   }
// })

router.post("/:userId/:token", forgotPasswordController.handlePasswordReset);


module.exports = router;
