const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadMultipleFiles } = require("../controllers/fileUploads.controller");

// Configurer Multer pour stocker les fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Dossier de destination
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route POST pour télécharger plusieurs fichiers
router.post("/upload-multiple", upload.any(), uploadMultipleFiles);

module.exports = router;
