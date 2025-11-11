// Fichier: backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const Client = require('../models/Client'); // Import pour trouver l'utilisateur

const protect = async (req, res, next) => {
    let token;

    // 1. Vérifier si un token existe et s'il est au format "Bearer Token"
    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extraire le token (le couper après 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // 2. Vérifier le token (avec la clé secrète)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // 3. Trouver le client dans la base de données et l'attacher à l'objet requête (req)
            // On exclut le mot de passe dans la requête (select('-motDePasse'))
            req.client = await Client.findById(decoded.id).select('-motDePasse');

            // 4. Passer au contrôleur suivant (la route est protégée et l'utilisateur est identifié)
            next();
            
        } catch (error) {
            console.error(error);
            // Le token est invalide ou expiré
            res.status(401).json({ message: 'Accès refusé. Token non valide.' });
        }
    }

    // Si aucun token n'est trouvé dans l'en-tête
    if (!token) {
        res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    }
};

module.exports = { protect };