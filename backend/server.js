// Fichier: backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const clientRoutes = require('./routes/clientRoutes'); // <--- NOUVEL IMPORT
const articleRoutes = require('./routes/articleRoutes'); // <--- NOUVEL IMPORT

require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000; 

const uri = process.env.MONGODB_URI; 

//mongoDB
mongoose.connect(uri)
    .then(() => console.log("✅ Connexion à MongoDB Atlas réussie !"))
    .catch(err => {
        console.error("❌ Échec de la connexion. Détails :", err.message);
    });

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// --- DÉFINITION DES ROUTES D'API ---
app.use('/api/client', clientRoutes); // <--- NOUVELLE UTILISATION
app.use('/api/articles', articleRoutes); // <--- NOUVELLE UTILISATION

// Route de Test
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API Arfoud est en cours d\'exécution. Bienvenue !' });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré avec succès sur le port ${PORT}`);
});