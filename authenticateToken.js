const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Ambil token dari header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formatnya: "Bearer TOKEN"

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden (token tidak valid)
    }
    
    // Simpan payload user ke object request agar bisa diakses di rute selanjutnya
    req.user = user;
    
    next(); // Lanjutkan ke rute
  });
};

module.exports = authenticateToken;