const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TokenSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 36000,
}
});



const Token = mongoose.model('Token', TokenSchema);


module.exports =  Token
