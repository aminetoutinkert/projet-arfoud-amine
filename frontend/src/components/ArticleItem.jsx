// Fichier: frontend/src/components/ArticleItem.jsx (Mise à jour complète pour la modification)

import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // <-- NOUVEL IMPORT

function ArticleItem({ article, onDelete }) {
    const navigate = useNavigate(); // <-- NOUVEL HOOK

    const onDeleteClick = () => { 
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'article : ${article.nom}?`)) {
            onDelete(article._id);
        }
    };

    // NOUVELLE FONCTION : Gestion de la navigation vers la page de modification
    const onEditClick = () => { // <-- AJOUT
        navigate(`/edit-article/${article._id}`);
    }; // <-- FIN AJOUT


    return (
        // La classe 'article' peut être définie dans votre main.css
        <div className='article'> 
            {/* L'article sera affiché de manière chronologique inversée (le plus récent en premier) */}
            <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>
                    Créé le: {new Date(article.createdAt).toLocaleString('fr-FR')}
                </span>
            </div>
            
            <h2>{article.nom}</h2>
            {article.image && (
                <img 
                    src={`http://localhost:5000${article.image}`} 
                    alt={article.nom} 
                    style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover', 
                        borderRadius: '5px', 
                        marginBottom: '15px' 
                    }} 
                />
            )}
            <p>{article.description}</p>
            
            {/* Affichage des détails */}
            <div className='article-details'>
                <p><strong>Prix:</strong> {article.prix.toFixed(2)} €</p>
                <p><strong>Stock:</strong> {article.quantiteStock}</p>
            </div>

            {/* Boutons d'action */}
            <div className='article-actions'>
                <button 
                    className='btn btn-reverse btn-sm' 
                    onClick={onEditClick} // <-- LIAISON DU BOUTON MODIFIER
                    style={{ marginRight: '10px' }}
                >
                    <FaEdit /> Modifier
                </button>
                <button 
                    className='btn btn-danger btn-sm' 
                    onClick={onDeleteClick} 
                >
                    <FaTrash /> Supprimer
                </button>
            </div>
        </div>
    );
}

export default ArticleItem;