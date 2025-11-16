// Fichier: frontend/src/components/ArticleForm.jsx (Contenu entier avec la modification commentée)

import React, { useState, useEffect, useRef } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { createArticle, reset, uploadImage } from '../features/articles/articleSlice'; // 🚨 Ajout de uploadImage

function ArticleForm() {
    const dispatch = useDispatch();
    const { isSuccess, isError, message, isLoading } = useSelector(
        (state) => state.article
    );

    const [formData, setFormData] = useState({
        nom: '', 
        description: '',
        prix: '', 
        quantiteStock: '',
    });
    const [image, setImage] = useState(''); // State pour l'URL de l'image

    const { nom, description, prix, quantiteStock } = formData;
    
    const hasHandledSuccess = useRef(false);

    // --- CORRECTION DU useEffect ---
    useEffect(() => {
        
        // 1. Si les drapeaux sont à false, on réinitialise la référence et on sort.
        if (!isError && !isSuccess) {
            hasHandledSuccess.current = false; 
            return; 
        }
        
        // 2. Bloquer le double traitement en Mode Strict si c'est déjà traité.
        if ((isSuccess || isError) && hasHandledSuccess.current) {
            return; 
        }
        
        if (isSuccess) {
            // Réinitialisation du formulaire UNIQUEMENT si c'est la création.
            if (message === "Article créé avec succès") {
                setFormData({ nom: '', description: '', prix: '', quantiteStock: '' });
                setImage(''); // Réinitialiser l'image
            }
            
            // 🚨 SUPPRESSION : Nous n'appelons plus getArticles ici.
            // Le Dashboard gère l'affichage des messages et le reset, ce qui 
            // permet au Dashboard de se rafraîchir correctement.
        }
        
        // Marquer comme traité avant le reset pour que le deuxième rendu l'ignore.
        hasHandledSuccess.current = true; 
        
        // 3. Le reset est appelé une fois le succès/échec traité
        dispatch(reset()); 

    }, [isSuccess, isError, message, dispatch]);


    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
            // S'assurer que les nombres restent des chaînes de caractères pour les inputs
        }));
    };

    const onFileChange = async (e) => {
        const imageData = new FormData();
        imageData.append('image', e.target.files[0]);
        
        try {
            const imageUrl = await dispatch(uploadImage(imageData)).unwrap();
            setImage(imageUrl);
        } catch (error) {
            console.error('Failed to upload image:', error);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        
        const articleData = {
            nom, 
            description,
            // Conversion en nombre avant l'envoi au service Redux
            prix: parseFloat(prix || 0),
            quantiteStock: parseInt(quantiteStock || 0), 
            image, // Ajout de l'URL de l'image
        };
        
        // Appel de l'action Redux
        dispatch(createArticle(articleData)); 
    };
    
    if (isLoading) {
        return <h2>Création en cours...</h2>; 
    }

    return (
        <section className='article-form'>
            <h3 style={{marginBottom: '15px'}}>Ajouter un Nouvel Article</h3>
            <form onSubmit={onSubmit}>
                
                {/* Champ NOM */}
                <div className='form-group'>
                    <label htmlFor='nom'>Nom de l'article</label>
                    <input
                        type='text'
                        name='nom'
                        id='nom'
                        className='form-control'
                        value={nom}
                        placeholder="Ex: Ordinateur Portable Gamer" 
                        onChange={onChange}
                        required
                    />
                </div>

                {/* Champ Description */}
                <div className='form-group'>
                    <label htmlFor='description'>Description</label>
                    <textarea
                        name='description'
                        id='description'
                        className='form-control'
                        value={description}
                        placeholder="Description détaillée de l'article..." 
                        onChange={onChange}
                        required
                    ></textarea>
                </div>
                
                {/* Champ Prix */}
                <div className='form-group'>
                    <label htmlFor='prix'>Prix (en devise locale)</label>
                    <input
                        type='number'
                        name='prix'
                        id='prix'
                        className='form-control'
                        value={prix}
                        placeholder='Ex: 1500.00' 
                        onChange={onChange}
                        min='0'
                        step='0.01'
                        required
                    />
                </div>

                {/* Champ QUANTITÉ EN STOCK */}
                <div className='form-group'>
                    <label htmlFor='quantiteStock'>Quantité en stock</label>
                    <input
                        type='number'
                        name='quantiteStock'
                        id='quantiteStock'
                        className='form-control'
                        value={quantiteStock}
                        placeholder='Ex: 10' 
                        onChange={onChange}
                        min='0'
                        required
                    />
                </div>

                {/* Champ Image */}
                <div className='form-group'>
                    <label htmlFor='image'>Image de l'article</label>
                    <input
                        type='file'
                        name='image'
                        id='image'
                        className='form-control'
                        onChange={onFileChange}
                    />
                </div>
                
                {/* Bouton de Soumission */}
                <div className='form-group'>
                    <button type='submit' className='btn btn-block'>
                        Créer l'Article
                    </button>
                </div>
            </form>
        </section>
    );
}

export default ArticleForm;