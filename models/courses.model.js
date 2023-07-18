const mongoose = require("mongoose");


// Define the Course Schema
const courseSchema = new mongoose.Schema({
    name: String,
    description: String,
    instructor: String,
    level: String,
    duration: String,
    createdAt: { type: Date},
    updatedAt: { type: Date, default: Date.now },
    // Other course fields...
  });

  // Create the Course model
const Course = mongoose.model('Course', courseSchema);
module.exports = Course;