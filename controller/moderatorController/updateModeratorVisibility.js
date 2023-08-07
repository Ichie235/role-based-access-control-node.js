const Moderator = require('../../models/moderator.model'); 


// Define the controller methods
const updateVisibility = async (req, res) => {
  const id = req.params.id;
  const visibility = req.body.visibility === 'true';

  try {
    const moderator = await Moderator.findById(id);
    if (!moderator) {
      return res.status(404).flash('Moderator not found');
    }

    moderator.visibility = visibility;
    await moderator.save();

    res.sendStatus(200); // Send a success response
  } catch (error) {
    console.error(error);
    res.status(500).flash('Internal Server Error');
  }
};

// Export the controller method
module.exports = {
  updateVisibility
};
