const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Courses = require("./courses.model")
const createHttpError = require("http-errors");


const ClientSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
      },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
  selectedCourses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      name: String,
      level: String,
    },
  ],  
  createdAt: { type: Date},
  updatedAt: { type: Date, default: Date.now },
});



// Create a virtual property to combine course name and ObjectId
ClientSchema.virtual('selectedCoursesWithDetails').get(function () {
  return this.selectedCourses.map((selectedCourse) => {
    const course = Courses.findById(selectedCourse.course);
    return {
      courseName: course.name,
      courseId: selectedCourse.course,
      level: selectedCourse.level,
    };
  });
});

const Client = mongoose.model("client", ClientSchema);
module.exports = Client;
