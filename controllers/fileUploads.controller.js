const { User, FileUpload } = require("../models");
const path = require("path"); // Module pour gérer les chemins des fichiers
const fs = require("fs"); // Module pour manipuler le système de fichiers

const uploadMultipleFiles = async (req, res) => {
  try {
    const { userId } = req.body; // Récupérer l'ID utilisateur
    const files = req.files; // Tous les fichiers envoyés
    console.log(req.files);

    if (!userId || !files || files.length === 0) {
      return res.status(400).json({ message: "ID utilisateur ou fichiers manquants." });
    }

    const user = await User.findByPk(userId); // Vérifier si l'utilisateur existe

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    const uploads = [];

    // Enregistrer chaque fichier dans la base de données
    for (const file of files) {
      // Créer un nouveau nom de fichier basé uniquement sur le timestamp et un identifiant unique
      const timestamp = Date.now(); // Timestamp actuel
      const uniqueId = Math.round(Math.random() * 1e9); // Identifiant aléatoire
      const extension = path.extname(file.originalname); // Extension du fichier
      const newFileName = `${timestamp}-${uniqueId}${extension}`; // Nom formaté

      // Chemin complet du nouveau fichier
      const newFilePath = path.join(path.dirname(file.path), newFileName);

      // Renommer le fichier
      fs.renameSync(file.path, newFilePath);

      // Enregistrer dans la base de données
      const newFile = await FileUpload.create({
        file_name: newFileName,
        file_path: newFilePath,
        file_type: file.fieldname,
        user_id: user.id,
      });
      uploads.push(newFile);
    }

    res.status(201).json({
      message: "Fichiers téléchargés avec succès.",
      files: uploads,
    });
  } catch (error) {
    console.error("Erreur lors du téléchargement des fichiers :", error);
    res.status(500).json({ message: "Erreur interne du serveur.", error });
  }
};

module.exports = {
  uploadMultipleFiles,
};
