// Fichier: backend/routes/clientRoutes.js

const express = require('express');
const router = express.Router(); // <--- Assurez-vous que c'est bien 'router'
const clientController = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware'); // <--- NOUVEL IMPORT

// Route d'inscription
// Chemin total: POST /api/client/register
router.post('/register', clientController.registerClient);

// Nouvelle Route de Connexion (Login)
// Chemin total: POST /api/client/login
router.post('/login', clientController.loginClient); // <--- Vérification du POST /login

// NOUVELLE ROUTE : Le middleware 'protect' s'exécute en premier !
router.get('/profile', protect, clientController.getClientProfile);

module.exports = router; // <--- Assurez-vous que c'est bien 'router' qui est exporté

