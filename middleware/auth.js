const jwt = require('jsonwebtoken');
require('dotenv').config(); // Charger les variables d'environnement
// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  // Vérifiez le token
  jwt.verify(token.split(' ')[1], process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = decoded; // Ajoutez les données décodées à la requête
    next();
  });
};

module.exports = { verifyToken };
