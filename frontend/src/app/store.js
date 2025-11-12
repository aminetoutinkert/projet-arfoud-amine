// Fichier: frontend/src/app/store.js (Mise à jour pour inclure un reducer temporaire)

import { configureStore, createSlice } from '@reduxjs/toolkit'; // <-- MODIFICATION: Import de createSlice

// Reducer temporaire vide pour éviter l'erreur de configuration du store
const tempSlice = createSlice({
    name: 'temp',
    initialState: {},
    reducers: {},
});

export const store = configureStore({
    reducer: {
        // MODIFICATION: Ajout du reducer temporaire
        temp: tempSlice.reducer,
    },
});