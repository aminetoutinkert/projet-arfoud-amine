// Fichier: frontend/src/pages/Dashboard.jsx 

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // <-- HOOKS REDUX

// Importation des composants et des actions REDUX
import ArticleForm from '../components/ArticleForm';
import ArticleItem from '../components/ArticleItem';
import { getArticles, deleteArticle, reset as resetArticleState } from '../features/articles/articleSlice';
import { reset as resetAuthState } from '../features/auth/authSlice';


function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 1. Récupération des états REDUX (plus besoin de localStorage ici)
    const { client } = useSelector((state) => state.auth);
    const {
        articles,
        isLoading,
        isError,
        message
    } = useSelector((state) => state.article);


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
            alert(message);
        }

        // Appel de l'action asynchrone REDUX
        dispatch(getArticles()); // <-- UTILISATION DE REDUX

        return () => {
            dispatch(resetArticleState());
        };
    }, [client, navigate, isError, message, dispatch]);


    // 3. Fonction de suppression (Appelle l'action deleteArticle de Redux)
    const onDelete = (articleId) => { // <-- NOM DE LA FONCTION AJUSTÉ
        dispatch(deleteArticle(articleId));
    };


    // 4. Affichage des états (Chargement/Erreur)
    if (isLoading) {
        return <h1>Chargement des articles...</h1>;
    }

    // 5. Rendu principal (Le reste de votre structure est correct)
    return (
        <>
            <section className='heading'>
                <h1>Bienvenue, {client && client.nom}</h1>
                <p>Vos articles en stock :</p>
            </section>

            <ArticleForm />

            <section className='content'>
                {/* Changement de titre pour correspondre au code précédent */}
                <h3 style={{ marginTop: '30px', marginBottom: '20px' }}>
                    Vos Articles ({Array.isArray(articles) ? articles.length : 0}) {/* CORRECTION APPLIQUÉE ICI */}
                </h3>

                {Array.isArray(articles) && articles.length > 0 ? (
                    <div className='articles'>
                        {articles.map((article) => (
                            <ArticleItem
                                key={article._id}
                                article={article}
                                onDelete={onDelete} // <-- TRANSMISSION de la fonction Redux
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