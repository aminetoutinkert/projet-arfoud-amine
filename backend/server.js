// Fichier: backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); // Import path module
const clientRoutes = require('./routes/clientRoutes');
const articleRoutes = require('./routes/articleRoutes');
const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

// Middleware de gestion des erreurs (Express l'identifie par sa signature à 4 arguments)
const errorHandler = (err, req, res, next) => { // <-- DOIT ÊTRE PRÉSENT
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // <-- Ajouté si manquant pour les données de formulaire

// --- DÉFINITION DES ROUTES D'API ---
app.use('/api/clients', clientRoutes);
app.use('/api/articles', articleRoutes);

// --- SERVIR LES FICHIERS STATIQUES (IMAGES) ---
app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')));

// Route de Test
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API Arfoud est en cours d\'exécution. Bienvenue !' });
});

// Utilisation du middleware d'erreur pour intercepter les erreurs des asyncHandler (DOIT ÊTRE APRÈS LES ROUTES)
app.use(errorHandler); // <-- DOIT ÊTRE UTILISÉ APRÈS LES ROUTES

// Démarrage du serveur (conditionnel pour les tests)
if (process.env.NODE_ENV !== 'test') {
    //mongoDB
    mongoose.connect(uri)
        .then(() => console.log("✅ Connexion à MongoDB Atlas réussie !"))
        .catch(err => {
            console.error("❌ Échec de la connexion. Détails :", err.message);
        });

    app.listen(PORT, () => {
        console.log(`Serveur démarré avec succès sur le port ${PORT}`);
    });
}

module.exports = app; // <-- EXPORT DE L'APPLICATION POUR LES TESTS
