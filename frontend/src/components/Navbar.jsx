// Fichier: frontend/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { FaFeatherAlt } from 'react-icons/fa'; // Import a logo icon

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get client state from Redux store
  const { client } = useSelector((state) => state.auth);

  // Dispatch logout action
  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/'>
          <FaFeatherAlt style={{ marginRight: '8px' }} /> ARFOUD
        </Link>
      </div>
      
      <ul>
        {client ? ( // If client is logged in
          <>
            <li>
              <Link to='/dashboard'>Tableau de Bord</Link>
            </li>
            <li>
              <button className='btn btn-logout' onClick={onLogout}>
                Se Déconnecter
              </button>
            </li>
          </>
        ) : ( // If client is not logged in
          <>
            <li>
              <Link to='/login'>Se Connecter</Link>
            </li>
            <li>
              <Link to='/register'>S'Inscrire</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Navbar;