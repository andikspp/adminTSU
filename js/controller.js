const path = require('path');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const OTP = require('otp-generator');
const User = require('./Users');

const renderHomePage = (req, res) => {
  const htmlFilePath = path.join(__dirname, '../html/signInResponsive.html');
  res.sendFile(htmlFilePath);
};

const registerUser = async (req, res) => {
    const { nama, email, password } = req.body;
  
    try {
      // Hash password menggunakan bcrypt
      const hashedPassword = await bcrypt.hash(password, 10); // 10 adalah jumlah iterasi hash
  
      // Generate OTP
      const otp = OTP.generate(6, { upperCase: false, specialChars: false });
      const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP berlaku selama 5 menit
  
      const newUser = new User({
        nama,
        email,
        password: hashedPassword,
        otp,
        otpExpiration,
        isVerified: false
      });
  
      await newUser.save();
  
      // Kirim OTP ke email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP for Registration',
        text: `Your OTP: ${otp}`
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: 'Error sending OTP' });
        }
        console.log('OTP sent: ' + info.response);
        res.send(`
          <script>
            alert('Registrasi berhasil! Kode OTP telah dikirimkan ke email Anda.');
            window.location.href = '/input-otp.html';
          </script>
        `);
      });
    } catch (err) {
      console.error('Gagal menyimpan data pengguna', err);
      res.status(500).send('Registrasi gagal');
    }
  };
  

  const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.isVerified) {
        return res.status(400).json({ message: 'User already verified' });
      }
  
      if (user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      const now = new Date();
      if (now > user.otpExpiration) {
        return res.status(400).json({ message: 'OTP has expired' });
      }
  
      user.isVerified = true;
      await user.save();
  
      // Redirect user to sign-in page
      res.redirect('/success.html');
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

const renderLoginPage = (req, res) => {
  const loginPagePath = path.join(__dirname, '../html/signInResponsive.html');
  res.sendFile(loginPagePath);
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        // Pengguna tidak ditemukan, tampilkan pesan error
        res.send(`
          <script>
            alert('Email atau password salah!');
            window.location.href = '/login';
          </script>
        `);
      } else {
        // Verifikasi password menggunakan bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (passwordMatch) {
          // Password cocok, tampilkan pesan sukses atau redirect ke halaman lain
          res.redirect('/tesHome.html');
        } else {
          // Password tidak cocok, tampilkan pesan error
          res.send(`
            <script>
              alert('Email atau password salah!');
              window.location.href = '/login';
            </script>
          `);
        }
      }
    } catch (err) {
      console.error('Gagal melakukan login', err);
      res.status(500).send('Login gagal');
    }
  };
  

  const logoutUser = (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Gagal menghapus sesi', err);
        } else {
          res.redirect('/login');
        }
      });
    } else {
      res.redirect('/login');
    }
  };
  

module.exports = {
  renderHomePage,
  registerUser,
  verifyOTP,
  renderLoginPage,
  loginUser,
  logoutUser,
};
