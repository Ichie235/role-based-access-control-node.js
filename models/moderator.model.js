const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Courses = require("./courses.model");
const createHttpError = require("http-errors");

const ModeratorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  description: {
    type: String,
    lowercase: true,
  },
  qualification: {
    type: String,
    lowercase: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  selectedCourses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    },
  ],
  level: {
    type: [String],
  },
});

const Moderator = mongoose.model("moderator", ModeratorSchema);
module.exports = Moderator;
