const express = require('express');
const router = express.Router();
const path = require('path');

// Impor controller
const {
  renderHomePage,
  registerUser,
  verifyOTP,
  renderLoginPage,
  loginUser,
  logoutUser,
} = require('./controller');

// Rute untuk halaman beranda
router.get('/', renderHomePage);

// Route untuk menyimpan data pengguna ke database
router.post('/registrasi', registerUser);

router.post('/verifyotp', verifyOTP);

// Rute untuk halaman login
router.get('/login', renderLoginPage);

// Route untuk melakukan proses login
router.post('/login', loginUser);

// Rute untuk melakukan proses logout
router.get('/logout', logoutUser);

module.exports = router;
