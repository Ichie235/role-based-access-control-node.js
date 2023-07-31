const router = require("express").Router();
const Client = require("../models/client.model");
const User = require("../models/user.model");
const Course = require("../models/courses.model");
const bcrypt = require("bcrypt");

router.get("/profile", async (req, res, next) => {
  //console.log(req.user);
  const person = req.user;
  res.render("profile", { person });
});

// Define route for finding moderators
router.get("/findModerator", (req, res) => {
  User.find(
    { role: "MODERATOR" },
    "firstName lastName email",
    (err, moderators) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.render("findTutor", { moderators });
      }
    }
  );
});

// Define route for finding moderators for a particular course and level

router.post("/findModerator", async (req, res) => {
  try {
    const { selectedCourses, level } = req.body;

    // Create an array of regex patterns from the selectedCourses
    const courseRegex = selectedCourses.map((courseId) => new RegExp(courseId));

    // Perform the regex search for moderators
    const moderators = await Moderator.find({
      level: { $in: level }, // Match the moderators with the given level(s)
      "selectedCourses.course": { $in: courseRegex }, // Match the moderators with any of the selectedCourses
    }).populate("user", "firstName lastName"); // Populate the user field with firstName and lastName

    // Extract moderator names from the user field
    const moderatorNames = moderators.map(
      (moderator) => `${moderator.user.firstName} ${moderator.user.lastName}`
    );

    res.json(moderatorNames);
  } catch (error) {
    console.error("Error searching for moderators:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Export the router
module.exports = router;

router.post("/account/personal-details", (req, res) => {
  // Retrieve the password, password2, and other fields from the request body
  const { password, password2, town, street, country, postcode } = req.body;

  // Check if the user is logged in
  if (req.user) {
    // Verify that the password and password2 match, if provided
    if (password && password2 && password === password2) {
      // Generate a salt and hash the password
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
          // Update the user's password and other details
          User.findById(req.user.id, (err, user) => {
            if (err) {
              req.flash("error", "Internal Server Error");
              return res.redirect("/user/profile");
            }
            user.password = hashedPassword;
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
        });
      });
    } else {
      // Update the user's other details if the password is not provided or does not match
      User.findById(req.user.id, (err, user) => {
        if (err) {
          req.flash("error", "Internal Server Error");
          return res.redirect("/user/profile");
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
    }
  } else {
    res.status(401).send("Unauthorized");
  }
});

router.get("/courses", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.redirect("/login");
    }

    const allCourses = await Course.find();

    const client = await Client.findOne({ user: req.user._id }).populate(
      "selectedCourses"
    );

    res.render("courses", {
      courses: allCourses,
      selectedCourses: client ? client.selectedCourses : [],
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Server Error");
  }
});

// Define the '/courses/send' route
router.post("/courses/send", async (req, res) => {
  try {
    const user = req.user;
    const { selectedCourses } = req.body;

    // Ensure selectedCourses is an array of objects
    // Modify the selectedCourses array to include name and level properties
    const coursesPromise = selectedCourses.map(async (courseId) => {
      const course = await Course.findById(courseId);
      return {
        _id: course._id,
        name: course.name,
        level: course.level,
      };
    });

    // Wait for all promises to resolve
    const courses = await Promise.all(coursesPromise);
    console.log(courses);

    let client = await Client.findOne({ user: user }).populate(
      "selectedCourses"
    );

    if (!client) {
      const email = user.email;
      client = new Client({
        email: email,
        user: user,
        selectedCourses: courses,
      });
    } else {
      client.selectedCourses = courses;
    }
    await client.save();

    console.log("Course selection saved:", client);
    res.redirect("/");
  } catch (error) {
    console.error("Error saving course selection:", error);
    res.redirect("/error");
  }
});

module.exports = router;
