// Fichier: frontend/src/main.jsx (Mise à jour pour inclure Redux Provider)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './main.css';
import { store } from './app/store'; // <-- MODIFICATION: Import du store
import { Provider } from 'react-redux'; // <-- MODIFICATION: Import du Provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* MODIFICATION: Enveloppement de l'application avec le Provider de Redux */}
    <Provider store={store}> 
      <App />
    </Provider>
  </React.StrictMode>
);