// Fichier: frontend/src/pages/Dashboard.jsx 

import React, { useEffect, useRef } from 'react'; // 🚨 AJOUT DE useRef
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Importation des composants et des actions REDUX
import ArticleForm from '../components/ArticleForm';
import ArticleItem from '../components/ArticleItem';
import { getArticles, deleteArticle, reset as resetArticleState } from '../features/articles/articleSlice';
import { reset as resetAuthState } from '../features/auth/authSlice';


function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 1. Récupération des états REDUX
    const { client } = useSelector((state) => state.auth);
    const {
        articles,
        isLoading,
        isError,
        isSuccess, // 🚨 RÉCUPÉRATION DU DRAPEAU isSuccess
        message
    } = useSelector((state) => state.article);

    // 🚨 NOUVEAU : Réf pour ignorer le double appel de useEffect en Mode Strict
    const alertHandledRef = useRef(false);

    // 2. Gestion de l'état (Redirection, Erreurs, Chargement des données)
    useEffect(() => {
        if (!client) {
            navigate('/login');
            dispatch(resetArticleState());
            dispatch(resetAuthState());
            return;
        }

        if (isError) {
            console.error(message);
            // Nous laissons l'alerte d'erreur ici pour les erreurs de chargement initiales.
            alert(message); 
        }

        // Appel de l'action asynchrone REDUX pour charger la liste
        dispatch(getArticles()); 

        return () => {
            dispatch(resetArticleState());
        };
        // Suppression de 'message' des dépendances ici pour éviter de relancer getArticles à chaque changement de message
    }, [client, navigate, isError, dispatch]);


    // 🚨 NOUVEAU useEffect pour GÉRER LES MESSAGES DE SUCCÈS/ERREUR APRÈS ACTION (Création/Suppression) 🚨
    useEffect(() => {
        
        // 1. Si les drapeaux sont à false, on réinitialise la référence et on sort.
        if (!isError && !isSuccess) {
            alertHandledRef.current = false;
            return;
        }

        // 2. Bloquer le double message en Mode Strict si déjà traité.
        if ((isSuccess || isError) && alertHandledRef.current) {
            return;
        }

        // 3. Afficher le message (Succès ou Erreur)
        if (message) {
            // Note: L'alerte d'erreur lors du chargement initial est gérée par le useEffect principal.
            // Ceci gère les erreurs post-action (création/suppression) ou le succès.
            alert(message);
        }
        
        // 4. Marquer comme traité avant le reset.
        alertHandledRef.current = true;
        
        // 5. Réinitialiser l'état global du slice (isSuccess/isError/message)
        dispatch(resetArticleState());

    }, [isSuccess, isError, message, dispatch]); // Dépendances: isSuccess est maintenant surveillé


    // 3. Fonction de suppression (Appelle l'action deleteArticle de Redux)
    const onDelete = (articleId) => {
        dispatch(deleteArticle(articleId));
    };


    // 4. Affichage des états (Chargement/Erreur)
    if (isLoading) {
        return <h1>Chargement des articles...</h1>;
    }

    // 5. Rendu principal
    return (
        <>
            <section className='heading'>
                <h1>Bienvenue, {client && client.nom}</h1>
                <p>Vos articles en stock :</p>
            </section>

            <ArticleForm />

            <section className='content'>
                <h3 style={{ marginTop: '30px', marginBottom: '20px' }}>
                    Vos Articles ({Array.isArray(articles) ? articles.length : 0})
                </h3>

                {Array.isArray(articles) && articles.length > 0 ? (
                    <div className='articles'>
                        {articles.map((article) => (
                            <ArticleItem
                                key={article._id}
                                article={article}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <h3>Vous n'avez pas encore d'articles enregistrés.</h3>
                )}
            </section>
        </>
    );
}

export default Dashboard;