const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const Courses = require("./courses.model")
const createHttpError = require("http-errors");
const { roles } = require("../utils/constants");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [roles.admin, roles.moderator, roles.client],
    default: roles.client,
  },
  street: {
    type: String,
    lowercase: true,
  },
  town: {
    type: String,
    lowercase: true,
  },
  country: {
    type: String,
    lowercase: true,
  },
  postcode: {
    type: String,
    lowercase: true,
  },
  createdAt: { type: Date},
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      if (this.email === process.env.ADMIN_EMAIL.toLowerCase()) {
        this.role = roles.admin;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Check if password is valid
UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw createHttpError.InternalServerError(error.message);
  }
};

// Create a virtual property to combine course name and ObjectId
UserSchema.virtual('selectedCoursesWithDetails').get(function () {
  return this.selectedCourses.map((selectedCourse) => {
    const course = Courses.findById(selectedCourse.course);
    return {
      courseName: course.name,
      courseId: selectedCourse.course,
      level: selectedCourse.level,
    };
  });
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
