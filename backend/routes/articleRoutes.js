// Fichier: backend/routes/articleRoutes.js

const express = require('express');
const router = express.Router();
const { createArticle, getArticles, getArticle, updateArticle, deleteArticle } = require('../controllers/articleController'); 
const { protect } = require('../middleware/authMiddleware');

// Route de création d'article
// POST /api/articles
// Elle est protégée, donc 'protect' s'exécute en premier
// Route de base /api/articles
router.route('/')
    .post(protect, createArticle)  // POST pour créer
    .get(protect, getArticles);    // <--- NOUVELLE ROUTE : GET pour lire la liste

// Route pour gérer un article spécifique par ID
// GET /api/articles/:id (Lecture)
// PUT /api/articles/:id (Mise à jour)
router.route('/:id')
    .get(protect, getArticle)
    .put(protect, updateArticle) // <--- NOUVELLE ROUTE (PUT par ID)
    .delete(protect, deleteArticle); // <--- NOUVELLE ROUTE (DELETE par ID)

module.exports = router;