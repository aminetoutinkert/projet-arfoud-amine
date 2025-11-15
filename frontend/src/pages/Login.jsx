// Fichier: frontend/src/pages/Login.jsx (Refactorisation Redux)

import React, { useState, useEffect } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify'; // <-- NOUVEL IMPORT

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        motDePasse: '', // <-- MODIFICATION CLÉ 1: Changement de 'password' à 'motDePasse'
    });

    const { email, motDePasse } = formData; // <-- MODIFICATION CLÉ 2: Changement de 'password' à 'motDePasse'

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Récupération de l'état (state) de Redux
    const { client, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    // Effet pour gérer les redirections et les messages
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        // Si la connexion est réussie ou si l'utilisateur est déjà connecté
        if (isSuccess || client) {
            navigate('/dashboard');
        }

        // Réinitialiser les drapeaux (isSuccess, isError) après leur utilisation
        dispatch(reset());

    }, [client, isError, isSuccess, message, navigate, dispatch]);


    // Gère la mise à jour des champs du formulaire
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // Gère la soumission du formulaire
    const onSubmit = (e) => {
        e.preventDefault();

        const clientData = {
            email,
            motDePasse, // <-- MODIFICATION CLÉ 3: Utiliser la variable motDePasse
        };

        // APPEL DE L'ACTION REDUX (remplace l'appel axios direct)
        dispatch(login(clientData));
    };

    // Affichage de chargement
    if (isLoading) {
        return <h1>Chargement...</h1>;
    }

    return (
        <>
            <section className='heading'>
                <h1>
                    <FaSignInAlt /> Se Connecter
                </h1>
                <p>Connectez-vous pour voir vos articles</p>
            </section>

            <section className='form'>
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <input
                            type='email'
                            className='form-control'
                            id='email'
                            name='email'
                            value={email}
                            placeholder='Entrer votre email'
                            onChange={onChange}
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type='password'
                            className='form-control'
                            id='motDePasse' // <-- MODIFICATION CLÉ 4: Changer l'ID/name du champ
                            name='motDePasse' // <-- MODIFICATION CLÉ 5: Changer l'ID/name du champ
                            value={motDePasse} // <-- Utiliser la variable 'motDePasse'
                            placeholder='Entrer votre mot de passe'
                            onChange={onChange}
                        />
                    </div>

                    <div className='form-group'>
                        <button type='submit' className='btn btn-block'>
                            Se Connecter
                        </button>
                    </div>
                </form>
            </section>
        </>
    );
}

export default Login;