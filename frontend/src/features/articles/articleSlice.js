// Fichier: frontend/src/features/articles/articleSlice.js (Contenu entier)

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
export const createArticle = createAsyncThunk(
    'articles/create',
    async (articleData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.client.token;
            return await articleService.createArticle(articleData, token);
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
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            // ==================== CREATE ARTICLE ====================
            .addCase(createArticle.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false; // Sécurité
            })
            .addCase(createArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Ajoute le nouvel article au début du tableau existant
                state.articles.unshift(action.payload);
                state.message = "Article créé avec succès"; // 🚨 NOUVEAU MESSAGE SPÉCIFIQUE
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.articles = [];
                state.message = action.payload;
            })

            // ==================== GET ARTICLES ====================
            .addCase(getArticles.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getArticles.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.isSuccess = true; // 🚨 LIGNE RETIRÉE
                state.articles = action.payload;
            })
            .addCase(getArticles.rejected, (state, action) => {
                state.isLoading = false;
                // state.isError = true; // 🚨 LIGNE RETIRÉE
                state.message = action.payload;
                state.articles = [];
            })

            // ==================== DELETE ARTICLE ====================
            .addCase(deleteArticle.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false; // Sécurité
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const deletedId = action.meta.arg;
                state.articles = state.articles.filter(
                    (article) => article._id !== deletedId
                );
                // state.message était "action.payload.message" avant, nous le standardisons
                state.message = "Article supprimé avec succès"; // 🚨 NOUVEAU MESSAGE SPÉCIFIQUE
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