const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = 5500; // Ganti dengan port yang sesuai preferensi

// Middleware untuk mengizinkan CORS dari semua domain
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Middleware untuk session
app.use(session({
  secret: 'secret-key', // Ganti dengan secret key yang lebih aman
  resave: false,
  saveUninitialized: true
}));

// Middleware untuk menyimpan informasi status login
app.use((req, res, next) => {
  res.locals.isLoggedIn = false; // Defaultnya pengguna tidak masuk
  next();
});

// Middleware untuk memeriksa status login pada setiap request
app.use((req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.isLoggedIn = true; // Jika ada sesi user, berarti pengguna masuk
  }
  next();
});

// Middleware untuk parsing body dari request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Menyajikan seluruh proyek sebagai direktori statis
app.use(express.static('D:/TSU/ADMIN'));
app.use(express.static(path.join(__dirname, '../html')));
app.use(express.static(path.join(__dirname, '../css')));
app.use(express.static(path.join(__dirname, '../images')));

// Yang ini buat Koneksi ke MongoDB Atlas
const dbURI = 'mongodb+srv://andhika_pp:TI2rAzsOOZT0otfz@cluster0.xpbl2f2.mongodb.net/Autentifikasi?retryWrites=true&w=majority'; // Ganti dengan URI MongoDB Atlas Anda
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Koneksi ke MongoDB Atlas berhasil');
  })
  .catch((err) => {
    console.error('Koneksi ke MongoDB Atlas gagal', err);
  });

// Impor routes
const routes = require('./routes');

// Gunakan routes
app.use('/', routes);

// Server berjalan
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}/`);
});
