const mongoose = require('mongoose');
const Course = require('../models/courses.model');



// Making a connection to MongoDB
mongoose.connect("mongodb://localhost:27017/roleBasedAuth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('connected...');
    populateCourses();
  })
  .catch((err) => console.log(err.message));

const populateCourses = () => {
    const courseData = [
      { name: 'English', description: 'English language course', instructor: 'John Doe', level: 'Beginner', duration: '4 weeks' },
      { name: 'Mathematics', description: 'Mathematics course', instructor: 'Jane Smith', level: 'Intermediate', duration: '6 weeks' },
      // Add more course data as needed
    ];

    // Add createdAt field to each course object
  const coursesWithDate = courseData.map((course) => ({
    ...course,
    createdAt: Date.now(),
  }));

  
    Course.insertMany(coursesWithDate)
      .then((savedCourses) => {
        console.log('Courses populated:', savedCourses);
        mongoose.disconnect(); // Disconnect from MongoDB after populating the courses
      })
      .catch((error) => {
        console.error('Error populating courses:', error);
        mongoose.disconnect();
      });
  };
  

  module.exports = populateCourses;