const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authenticateToken = require('../authenticateToken');

// --- Rute Registrasi (Sign Up) ---
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Langkah Kunci Keamanan: Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10); // Angka 10 adalah "salt rounds"
    
    const newUser = await User.create({ email, password: hashedPassword });
    res.status(201).json({ message: 'User berhasil dibuat', user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    next(error);
  }
});

// --- Rute Login ---
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Bandingkan password yang diinput dengan yang ada di database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Buat JWT
    const payload = { id: user.id, email: user.email };
    const secret = process.env.JWT_SECRET;
    const expiresIn = '2m'; // Token akan hangus dalam 1 jam

    const token = jwt.sign(payload, secret, { expiresIn });

    res.json({ message: 'Login berhasil', token });

  } catch (error) {
    next(error);
  }
});

router.use(authenticateToken);
// GET /api/user: Mendapatkan semua tugas
router.get('/user', async (req, res) => {
    try {
        const user = await User.findAll();
        res.json(user);
    } catch (error) {
        next(error);
    }
});

module.exports = router;