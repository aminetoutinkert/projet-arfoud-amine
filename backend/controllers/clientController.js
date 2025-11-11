// Fichier: backend/controllers/clientController.js

const Client = require('../models/Client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // <--- NOUVEL IMPORT
const saltRounds = 10; 

// Fonction pour enregistrer un nouveau client (Inscription)
exports.registerClient = async (req, res) => {
    try {
        const { nom, prenom, email, motDePasse } = req.body;

        const clientExiste = await Client.findOne({ email });
        if (clientExiste) {
            return res.status(400).json({ message: "Un client avec cet email existe déjà." });
        }
        
        const hashedPassword = await bcrypt.hash(motDePasse, saltRounds);

        const nouveauClient = new Client({
            nom,
            prenom,
            email,
            motDePasse: hashedPassword 
        });

        const clientSauvegarde = await nouveauClient.save();

        res.status(201).json({ 
            _id: clientSauvegarde._id,
            nom: clientSauvegarde.nom,
            email: clientSauvegarde.email,
            message: "Client enregistré avec succès (Mot de passe haché)."
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de l'enregistrement.", error: error.message });
    }
};

// Fonction pour connecter un client (Login)
exports.loginClient = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        const client = await Client.findOne({ email });

        if (!client) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        const isMatch = await bcrypt.compare(motDePasse, client.motDePasse);

        if (!isMatch) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        // --- NOUVEAU : CRÉATION DU TOKEN JWT ---
        const token = jwt.sign(
            // Payload (les infos à encoder dans le token)
            { id: client._id }, 
            // Clé secrète
            process.env.JWT_SECRET, 
            // Options (durée de validité)
            { expiresIn: '1d' } 
        );
        // ------------------------------------------
        
        // 3. Connexion réussie : On renvoie le token et les infos de base
        res.status(200).json({
            _id: client._id,
            nom: client.nom,
            email: client.email,
            token: token, // <--- ON RENVOIE LE TOKEN
            message: "Connexion réussie. Bienvenue de nouveau !"
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de la connexion.", error: error.message });
    }
};

// Fonction pour récupérer le profil d'un client (Route Protégée)
exports.getClientProfile = async (req, res) => {
    // Les informations du client ont été ajoutées à req.client par le middleware
    // Si nous arrivons ici, c'est que le token est valide.
    res.status(200).json({
        _id: req.client._id,
        nom: req.client.nom,
        prenom: req.client.prenom,
        email: req.client.email,
        dateCreation: req.client.dateCreation
    });
};

// **VÉRIFIEZ BIEN QUE VOUS L'AVEZ EXPORTÉ**
// Vous pouvez modifier le bas du fichier pour qu'il ressemble à ceci si vous avez des doutes :
/*
exports.registerClient = ...
exports.loginClient = ...
exports.getClientProfile = ...
*/