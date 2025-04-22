const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ['farmer', 'company'] }
});

module.exports = mongoose.model('User', userSchema);