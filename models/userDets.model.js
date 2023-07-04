const mongoose = require('mongoose');

const UserDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Referencing the 'user' model
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const UserDetails = mongoose.model('userDetails', UserDetailsSchema);
module.exports = UserDetails;
