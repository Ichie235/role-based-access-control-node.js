const User = require("../../models/user.model");
const Token = require("../../models/Token");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../../utils/sendEmail");

// Controller function for handling password reset requests
const handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.render("forgot", { error: "User not found" });
      return;
    }

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    //user ID in session
    req.session.userId = user.id;
    console.log(user.id);

    const link = `${process.env.BASE_URL}/passwordReset/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", link);

    // Redirect to the password reset page with a success message
    res.render("forgot", {
      successMessage: "Check your email for the reset link",
    });
  } catch (error) {
    console.log(error);
    res.render("forgot", { error: "An error occurred" });
  }
};

// Controller function for handling password reset
const handlePasswordReset = async (req, res) => {
  const { password, password2 } = req.body;
  if (!req.session.userId) {
    res.redirect("/passwordReset/forgot");
    return;
  }
  try {
    if (password !== password2) {
      res.render("reset", { error: "Passwords do not match" });
      return;
    }
    const user = await User.findById(req.session.userId);

    if (!user) {
      res.redirect("/passwordReset/forgot");
      return;
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    user.password = hashedPassword;

    await user.save();

    // Redirect to login page with a success message
    res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
    res.redirect("/passwordReset/forgot");
  }
};

module.exports = {
  handleForgotPassword,
  handlePasswordReset,
};
