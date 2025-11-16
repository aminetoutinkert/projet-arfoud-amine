// Fichier: backend/routes/articleRoutes.js

const express = require('express');
const router = express.Router();
const { createArticle, getArticles, getArticle, updateArticle, deleteArticle } = require('../controllers/articleController'); 
const { protect } = require('../middleware/authMiddleware');
const path = require('path');
const multer = require('multer');

// --- Configuration de Multer pour le stockage des images ---
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/')); // Le dossier où les images seront stockées
    },
    filename(req, file, cb) {
        // Crée un nom de fichier unique pour éviter les conflits
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Middleware Multer pour gérer le téléversement d'un seul fichier
const upload = multer({ storage });

// --- Définition des routes ---

// Route pour gérer le téléversement d'une image
// POST /api/articles/upload
router.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        // Retourne une URL relative pour l'image téléversée
        res.status(200).json({ imageUrl: `/backend/uploads/${req.file.filename}` });
    } else {
        res.status(400).send('Aucun fichier téléversé.');
    }
});

// Route de base /api/articles
router.route('/')
    .get(protect, getArticles)
    .post(protect, createArticle);

// Route pour gérer un article spécifique par ID
router.route('/:id')
    .get(protect, getArticle)
    .put(protect, updateArticle)
    .delete(protect, deleteArticle);

module.exports = router;