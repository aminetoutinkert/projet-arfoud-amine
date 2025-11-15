// Fichier: frontend/src/pages/Register.jsx (Refactorisation Redux)

import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa'; // Ajout de l'icône si nécessaire
import { useSelector, useDispatch } from 'react-redux'; // <-- NOUVEL IMPORT REDUX
import { useNavigate } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice'; // <-- NOUVEL IMPORT REDUX
import { toast } from 'react-toastify'; // <-- NOUVEL IMPORT

// L'importation d'axios n'est plus nécessaire ici.
// import axios from 'axios'; 

function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    motDePasse2: '', // Pour la confirmation
  });

  const { nom, prenom, email, motDePasse, motDePasse2 } = formData;
  
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

    // Si l'inscription est réussie ou si l'utilisateur est déjà connecté
    if (isSuccess || client) {
      navigate('/dashboard');
    }

    // Réinitialiser les drapeaux (isSuccess, isError) après leur utilisation
    dispatch(reset()); 

  }, [client, isError, isSuccess, message, navigate, dispatch]);


  // 1. Gérer les changements dans le formulaire
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // 2. Gérer la soumission du formulaire
  const onSubmit = async (e) => { 
    e.preventDefault();

    if (motDePasse !== motDePasse2) {
      toast.error('Les mots de passe ne correspondent pas.');
    } else {
      const clientData = {
        nom,
        prenom,
        email,
        motDePasse,
      };
      
      // *** MODIFICATION CLÉ : APPEL DE L'ACTION REDUX 'register' ***
      dispatch(register(clientData));
      // *** FIN MODIFICATION ***
      
      // L'ancienne logique AXIOS est retirée et gérée par authSlice.js et l'useEffect ci-dessus
    }
  };

  // Affichage de chargement
  if (isLoading) {
    return <h1>Chargement...</h1>;
  }
  
  return (
    <>
      <section className='heading'>
        <h1>
            <FaUser /> S'inscrire
        </h1>
        <p>Créez votre compte client</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              id='nom'
              name='nom'
              value={nom}
              placeholder='Entrez votre nom'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              id='prenom' 
              name='prenom' 
              value={prenom} 
              placeholder='Entrez votre prénom' 
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Entrez votre email'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='motDePasse'
              name='motDePasse'
              value={motDePasse}
              placeholder='Choisissez un mot de passe'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='motDePasse2'
              name='motDePasse2'
              value={motDePasse2}
              placeholder='Confirmez le mot de passe'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              S'inscrire
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;