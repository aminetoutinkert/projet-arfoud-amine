// Fichier: frontend/src/features/articles/articleSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import articleService from './articleService';

// Définition de l'état initial
const initialState = {
    articles: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// ----------------------------------------------------------------------
// 1. Créer un nouvel article
// Utilisation de createAsyncThunk pour gérer la requête POST asynchrone
export const createArticle = createAsyncThunk(
    'articles/create',
    async (articleData, thunkAPI) => {
        try {
            // Le token JWT est nécessaire pour les routes protégées
            const token = thunkAPI.getState().auth.client.token;
            return await articleService.createArticle(articleData, token);
        } catch (error) {
            // Gestion et formatage du message d'erreur
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();

            // Rejeter la promesse et passer le message d'erreur dans l'action payload
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// ----------------------------------------------------------------------
// 2. Récupérer les articles de l'utilisateur
export const getArticles = createAsyncThunk(
    'articles/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.client.token;
            return await articleService.getArticles(token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// ----------------------------------------------------------------------
// 3. Supprimer un article
export const deleteArticle = createAsyncThunk(
    'articles/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.client.token;
            // articleService.deleteArticle renvoie le message de succès du backend
            return await articleService.deleteArticle(id, token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// ----------------------------------------------------------------------
// Création du Slice
export const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {
        // Reducer pour réinitialiser l'état (utilisé après la réussite/échec)
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            // ==================== CREATE ARTICLE ====================
            .addCase(createArticle.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Ajoute le nouvel article au début du tableau existant
                state.articles.unshift(action.payload);
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.articles = []; // [NOUVEAU] Assurez-vous que le tableau est vide en cas d'échec
                state.message = action.payload; // Le message d'erreur
            })

            // ==================== GET ARTICLES ====================
            .addCase(getArticles.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getArticles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Remplace le tableau par la liste complète reçue
                state.articles = action.payload;
            })
            .addCase(getArticles.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // ==================== DELETE ARTICLE ====================
            .addCase(deleteArticle.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // action.meta.arg contient l'ID passé à deleteArticle
                const deletedId = action.meta.arg;
                // Filtre le tableau pour retirer l'article supprimé
                state.articles = state.articles.filter(
                    (article) => article._id !== deletedId
                );
                // Le message est le retour du service (ex: "Article supprimé avec succès")
                state.message = action.payload.message;
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = articleSlice.actions;
export default articleSlice.reducer;