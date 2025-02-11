const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sendEmail, sendEmailWithAttachment, sendHtmlEmail, contact_email } = require('../controllers/email.controller');

// Configurer Multer pour les pièces jointes
const upload = multer({ dest: 'uploads/' }); // Stocker les fichiers dans le dossier "uploads"

// Route pour envoyer un email simple
router.post('/send', sendEmail);

// Route pour envoyer un email avec pièce jointe
router.post('/send-with-attachments', upload.array('files'), sendEmailWithAttachment);
router.post('/send-html', sendHtmlEmail);
router.post('/send-contact', contact_email);

module.exports = router;
