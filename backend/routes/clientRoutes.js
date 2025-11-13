// Fichier: backend/routes/clientRoutes.js

const express = require('express');
const router = express.Router(); 
const clientController = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware'); 

// 1. Route d'inscription (Création d'un client). Chemin total: POST /api/clients/
router.post('/', clientController.registerClient); // <-- MODIFIÉ : Utilise '/'

// 2. Nouvelle Route de Connexion (Login). Chemin total: POST /api/clients/login
router.post('/login', clientController.loginClient); // <-- CONSERVÉ

// 3. NOUVELLE ROUTE : Profil client. Chemin total: GET /api/clients/profile
router.get('/profile', protect, clientController.getClientProfile); // <-- CONSERVÉ

module.exports = router;