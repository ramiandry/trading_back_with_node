const nodemailer = require('nodemailer');
require('dotenv').config(); // Charger les variables d'environnement

// Configurer le transporteur Nodemailer
const transporter = nodemailer.createTransport({
  host: 'mail.wealthfunding.co',
  port: 465, // SSL
  secure: true, // true pour SSL, false pour TLS (587)
  auth: {
    user: process.env.EMAIL_USER, // Adresse email depuis .env
    pass: process.env.EMAIL_PASS, // Mot de passe ou App Password depuis .env
  },
  tls: {
    rejectUnauthorized: false, // Désactive la vérification de certificat
  },
});

// Vérifier si le transporteur est bien configuré
transporter.verify((error, success) => {
  if (error) {
    console.error('Erreur de configuration Nodemailer :', error);
  } else {
    console.log('Transporteur Nodemailer prêt à envoyer des emails');
  }
});

module.exports = transporter;
