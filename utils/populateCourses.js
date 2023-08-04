const mongoose = require('mongoose');
const Course = require('../models/courses.model');
const Moderator = require("../models/moderator.model")
require('dotenv').config();


// Making a connection to MongoDB
mongoose.connect("mongodb://localhost:27017", {
  dbName:"roleBasedAuth",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('connected...');
    //populateCourses();
    morderator()
  })
  .catch((err) => console.log(err.message));

  const morderator =()=>{
    const moderatorData = [
      {
        email: "moderator1@example.com",
        description: "Experienced moderator with a passion for teaching.",
        qualification: "Certified Instructor",
        selectedCourses: [
          { course: "615c7d9e78a3db001cc97e05" }, // Replace with valid Course ObjectId
          { course: "615c7d9e78a3db001cc97e06" }, // Replace with valid Course ObjectId
        ],
        level: ["beginner", "intermediate"],
      },
      {
        email: "moderator2@example.com",
        description: "Enthusiastic moderator with a background in programming.",
        qualification: "Masters in Computer Science",
        selectedCourses: [
          { course: "615c7d9e78a3db001cc97e06" }, // Replace with valid Course ObjectId
          { course: "615c7d9e78a3db001cc97e07" }, // Replace with valid Course ObjectId
        ],
        level: ["intermediate", "advanced"],
      },
     
    ];

     // Add createdAt field to each course object
     const moderatorWithDate = moderatorData.map((moderator) => ({
      ...moderator,
      createdAt: Date.now(),
    }));

  
    Moderator.insertMany(moderatorWithDate)
      .then((savedModerator) => {
        console.log('Courses populated:', savedModerator);
        mongoose.disconnect(); // Disconnect from MongoDB after populating the courses
      })
      .catch((error) => {
        console.error('Error populating courses:', error);
        mongoose.disconnect();
      });
        
  }

const populateCourses = () => {
    const courseData = [
      { name: 'English', description: 'English language course', level: 'Beginner', duration: '4 weeks' },
      { name: 'Mathematics', description: 'Mathematics course', instructor: 'Jane Smith', level: 'Intermediate', duration: '6 weeks' },
      { name: 'computer science', description: 'computer course', instructor: 'Jane Smith', level: 'Intermediate', duration: '6 weeks' },
      { name: 'Chemistry', description: 'Chemistry course', instructor: 'Jane Smith', level: 'Intermediate', duration: '6 weeks' },
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
  

  module.exports = morderator;