const Moderator = require('../../models/moderator.model'); 
const Courses = require('../../models/courses.model'); 

// Define the controller methods
const updateQualifications = async (req, res) => {
  const email = req.user.email;
  const selectedCourseIds = req.body.selectedCourses || [];
  const selectedAvailability = req.body.availability || [];

  try {
    const moderator = await Moderator.findOne({ email: email });

    const selectedCourses = await Promise.all(
      selectedCourseIds.map(async (courseId) => {
        const course = await Courses.findById(courseId);
        if (course) {
          return { course: course._id, name: course.name };
        }
      })
    );

    moderator.selectedCourses = selectedCourses.filter(Boolean); 

    moderator.qualification = req.body.qualification;
    moderator.experience = parseInt(req.body.experience);
    moderator.availability = selectedAvailability;
    moderator.specializations = req.body.specializations;
    moderator.rate = parseFloat(req.body.rate);
    moderator.paymentInfo = req.body.paymentInfo;

    await moderator.save();
    req.flash('success', 'Qualifications updated successfully');
    res.redirect('/moderator/profile');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Internal Server Error');
    res.redirect('/moderator/profile');
  }
};

// Export the controller method
module.exports = {
  updateQualifications
};
