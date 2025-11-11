// Fichier: backend/models/Article.js

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    // Référence à l'utilisateur qui a créé l'article (CRITIQUE pour l'autorisation)
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client' // Fait référence au modèle 'Client'
    },
    nom: {
        type: String,
        required: [true, 'Veuillez ajouter un nom pour l\'article'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Veuillez ajouter une description'],
    },
    prix: {
        type: Number,
        required: [true, 'Veuillez ajouter un prix'],
        default: 0,
    },
    quantiteStock: {
        type: Number,
        required: [true, 'Veuillez ajouter la quantité en stock'],
        default: 0,
    },
    image: {
        type: String, // Nous stockerons l'URL de l'image ici
        default: '',
    },
}, {
    // Ajoute automatiquement les champs 'createdAt' et 'updatedAt'
    timestamps: true 
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;