
/**
 * Middleware pour la gestion des téléchargements de fichiers
 * Ce module gère le téléchargement et le stockage des fichiers (principalement des images)
 * en utilisant multer pour le traitement des fichiers multipart/form-data
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Création du dossier uploads s'il n'existe pas
// Crée un répertoire pour stocker les fichiers téléchargés
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage des fichiers
// Définit comment et où les fichiers seront enregistrés
const storage = multer.diskStorage({
  // Définit le dossier de destination des fichiers
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  // Définit le nom du fichier sauvegardé
  filename: function (req, file, cb) {
    // Utilisation de l'ID de propriété s'il existe, sinon génère un timestamp
    const propertyId = req.params.id || ('prop_' + Date.now());
    const fileExt = path.extname(file.originalname);
    cb(null, `${propertyId}${fileExt}`);
  }
});

// Filtre pour vérifier les types de fichiers autorisés
// Seules les images sont acceptées (jpeg, jpg, png, gif, webp)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées!'));
  }
};

// Configuration du middleware multer avec les options définies
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille: 5MB
  fileFilter: fileFilter
});

module.exports = upload;
