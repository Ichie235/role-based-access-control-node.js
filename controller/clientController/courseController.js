const Course = require('../../models/courses.model'); 
const Client = require('../../models/client.model'); 

// Controller function for rendering the courses page
const renderCoursesPage = async (req, res, next) => {
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
};

// Controller function for handling course selection
const handleCourseSelection = async (req, res) => {
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
    res.redirect("/user/courses");
  } catch (error) {
    console.error("Error saving course selection:", error);
    res.redirect("/error");
  }
};



module.exports = { 
    renderCoursesPage,
    handleCourseSelection
};
