const mongoose = require("mongoose");


// Define the Course Schema
const courseSchema = new mongoose.Schema({
    name: String,
    description: String,
    level: String,
    duration: String,
    createdAt: { type: Date},
    updatedAt: { type: Date, default: Date.now },
  });
  
const Course = mongoose.model('Course', courseSchema);
module.exports = Course;