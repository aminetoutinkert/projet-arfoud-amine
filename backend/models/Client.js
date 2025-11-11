// Fichier: backend/models/Client.js

const mongoose = require('mongoose');

// Création du Schéma (structure de données)
const clientSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true, // Supprime les espaces blancs inutiles
        maxlength: 50
    },
    prenom: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true, // L'email doit être unique pour chaque client
        trim: true,
        lowercase: true // Convertit l'email en minuscules avant de sauvegarder
    },
    motDePasse: {
        type: String,
        required: true,
        minlength: 6 // Longueur minimale du mot de passe
    },
    dateCreation: {
        type: Date,
        default: Date.now // Définit la date actuelle par défaut
    }
}, {
    // Options de Schéma (pour ajouter des timestamps automatiques)
    timestamps: true 
});

// Création du Modèle basé sur le Schéma, et exportation
const Client = mongoose.model('Client', clientSchema);

module.exports = Client;