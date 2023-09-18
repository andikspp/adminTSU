const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nama: String,
  email: String,
  password: { type: String, required: true },
  otp: String,
  otpExpiration: Date,
  isVerified: Boolean,
}, {
  collection: 'Registrasi'
});

const User = mongoose.model('User', userSchema);

module.exports = User;
