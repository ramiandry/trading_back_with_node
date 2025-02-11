const transporter = require('../services/nodemailer');

// Fonction pour envoyer un email simple
const sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ message: 'Les champs to, subject et text sont requis.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, // Expéditeur
    to, // Destinataire
    subject, // Sujet
    text, // Corps du message
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email envoyé avec succès', info });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email', error });
  }
};

// Fonction pour envoyer un email avec pièce jointe
const sendEmailWithAttachment = async (req, res) => {
  const { to, subject, text } = req.body;
  const files = req.files; // Multer stocke les fichiers ici

  if (!to || !subject || !text || !files) {
    return res.status(400).json({ message: 'Les champs to, subject, text et fichiers sont requis.' });
  }

  const attachments = files.map(file => ({
    filename: file.originalname,
    path: file.path,
  }));

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email avec pièce jointe envoyé avec succès', info });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email avec pièce jointe :', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email', error });
  }
};

const sendHtmlEmail = async (req, res) => {
    const { to, subject, firstname, lastname, id } = req.body;
  
    // Vérifiez que les paramètres nécessaires sont présents
    if (!to || !subject) {
      return res.status(400).json({ message: 'Les champs to et subject sont requis.' });
    }
  
    // Contenu HTML de l'email
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="background-color: #00b26f; color: white; text-align: center; padding: 20px;">
    <h1 style="margin: 0; font-size: 24px;">Welcome to Wealth Funding Limited</h1>
    </div>
    <div style="display: flex; justify-content: center; margin-top: 30px;">
        <img src="cid:logo" alt="Wealth Funded Logo" style="height: 60px;margin: auto; margin-bottom: 10px !important;">
    </div>
      <div style="padding: 20px; color:#555 !important">
        <p style="color:#555 !important">Hello <strong>${firstname || ""} ${lastname || ""}</strong>,</p>
        <p style="color:#555 !important">We are thrilled to welcome you to our community! Your account has been successfully created. You can now explore our financial services and investment opportunities.</p>
 
        <p style="text-align: center; margin: 30px 0; ">
          <a href="http://localhost:5173/registration-details/${id}" 
             style="display: inline-block; padding: 15px 30px; font-size: 16px; color: #ffffff; background-color: #00b26f; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Confirm My Account
          </a>
        </p>
        <p style="color:#555 !important">If you did not request this account creation, please ignore this email.</p>
        <br>
        <p style="color: #555; text-align: center;">
          Best regards,<br>
          <strong>Wealth Funding Limited Team</strong>
        </p>
      </div>
      <div style="background-color: #00b26f; color: white; text-align: center; padding: 10px;">
        <p style="margin: 0; font-size: 12px;">&copy; 2025 Wealth Funding Limited. All rights reserved.</p>
      </div>
    </div>
  </div>
`;
  
    const mailOptions = {
      from: process.env.EMAIL_USER, // Expéditeur
      to, // Destinataire
      subject, // Sujet
      html: htmlContent, // Contenu HTML
      attachments: [
        {
          filename: 'logo.png',
          path: './ressources/logo1.png', // Remplacez par le chemin vers votre logo
          cid: 'logo', // Identifiant unique pour le logo dans l'email
        },
    ]
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      res.status(200).json({
        message: 'Email HTML envoyé avec succès.',
        info,
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email HTML :', error);
      res.status(500).json({
        message: 'Erreur lors de l\'envoi de l\'email.',
        error,
      });
    }
  };
  
  const contact_email=async (req, res) => {
    const { firstName, lastName, email, phoneNumber, subject, message } = req.body;
  
    try {
      // Envoyer un email
      const mailOptions = {
        from: '"Wealth Funding" contact@wealthfunding.co', // Sender's address
        to: 'contact@wealthfunding.co', // Recipient's email (support or final destination)
        subject: `New Contact Form Message: ${subject}`, // Email subject
        text: `
          New contact form message:
          Name: ${firstName} ${lastName}
          Email: ${email}
          Phone: ${phoneNumber}
          Subject: ${subject}
          Message: ${message}
        `,
        html: `
          <h3>New Contact Form Message</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phoneNumber}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      };
      
  
      await transporter.sendMail(mailOptions);
  
      // Répondre avec succès
      res.status(200).json({ message: 'Message envoyé avec succès.' });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email :', error);
      res.status(500).json({ error: 'Une erreur est survenue lors de l\'envoi du message.' });
    }
  }

module.exports = {
  sendEmail,
  sendEmailWithAttachment,
  sendHtmlEmail,
  contact_email
};
