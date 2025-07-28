require('dotenv').config();
const express = require('express');
const app = express();
const { sequelize } = require('./models'); // Impor koneksi sequelize
// const logger = require('./logger'); // Impor middleware logger
// const errorHandler = require('./errorHandler'); // Impor middleware errorHandler

// Middleware untuk membaca JSON dari body request
app.use(express.json());
// app.use(logger);

// Gunakan Rute untuk To-Do
// const todoRoutes = require('./routes/todos');
// app.use('/api/todos', todoRoutes);
const jwtRoutes = require('./routes/auth');
app.use('/api', jwtRoutes);

// Middleware untuk menangani error
// app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server berjalan di port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Berhasil terhubung ke database.');
  } catch (error) {
    console.error('Tidak dapat terhubung ke database:', error);
  }
});