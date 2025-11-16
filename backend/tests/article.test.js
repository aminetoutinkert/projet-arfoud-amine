// Fichier: backend/tests/article.test.js

require('dotenv').config(); // Charge les variables d'environnement du fichier .env

const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Client = require('../models/Client');
const Article = require('../models/Article');

let authToken; // Pour stocker le token d'authentification d'un client
let testClient; // Pour stocker le client créé pour les tests

// Avant tous les tests, connectez-vous à une base de données de test et créez un client
beforeAll(async () => {
  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) {
    throw new Error('MONGODB_URI is not defined in .env. Please provide it for tests.');
  }
  const testDbName = 'arfoud_article_test'; // Base de données de test pour les articles
  const uri = baseUri.substring(0, baseUri.lastIndexOf('/') + 1) + testDbName;

  try {
    await mongoose.connect(uri);

    // Crée un client de test et récupère son token
    const res = await request(app)
      .post('/api/clients/')
      .send({
        nom: 'ArticleTest',
        prenom: 'User',
        email: 'article.test@example.com',
        motDePasse: 'password123',
      });
    authToken = res.body.token;
    testClient = res.body._id;

  } catch (error) {
    console.error('Failed to connect to MongoDB or create test client for article tests:', error);
    throw error;
  }
}, 30000);

// Après chaque test, nettoyez les collections
afterEach(async () => {
  await Article.deleteMany({});
});

// Après tous les tests, déconnectez-vous de la base de données
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Article API', () => {
  // Test pour créer un article
  it('should create a new article for the authenticated client', async () => {
    const res = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nom: 'Test Article',
        description: 'Description for test article',
        prix: 100,
        quantiteStock: 10,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.nom).toEqual('Test Article');
    expect(res.body.client.toString()).toEqual(testClient); // Vérifie la propriété
  });

  // Test pour ne pas créer un article sans token
  it('should not create an article without authentication', async () => {
    const res = await request(app)
      .post('/api/articles')
      .send({
        nom: 'Unauthorized Article',
        description: 'Description',
        prix: 50,
        quantiteStock: 5,
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Accès refusé. Aucun token fourni.');
  });

  // Test pour obtenir tous les articles d'un client
  it('should get all articles for the authenticated client', async () => {
    // Crée plusieurs articles pour le client de test
    await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nom: 'Article 1', description: 'Desc 1', prix: 10, quantiteStock: 1 });
    await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nom: 'Article 2', description: 'Desc 2', prix: 20, quantiteStock: 2 });

    const res = await request(app)
      .get('/api/articles')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0].nom).toEqual('Article 2'); // Trié par createdAt DESC
  });

  // Test pour obtenir un article spécifique par ID
  it('should get a single article by ID for the owner', async () => {
    const createArticleRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nom: 'Single Article', description: 'Desc', prix: 30, quantiteStock: 3 });

    const articleId = createArticleRes.body._id;

    const res = await request(app)
      .get(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.nom).toEqual('Single Article');
  });

  // Test pour ne pas obtenir un article qui n'appartient pas au client
  it('should not get a single article if not the owner', async () => {
    // Crée un autre client
    const otherClientRes = await request(app)
      .post('/api/clients/')
      .send({
        nom: 'Other',
        prenom: 'User',
        email: 'other.user@example.com',
        motDePasse: 'otherpassword',
      });
    const otherAuthToken = otherClientRes.body.token;

    // Crée un article avec le client de test principal
    const createArticleRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nom: 'Owned Article', description: 'Desc', prix: 40, quantiteStock: 4 });
    const articleId = createArticleRes.body._id;

    // Tente d'accéder à l'article avec l'autre client
    const res = await request(app)
      .get(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${otherAuthToken}`);
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Non autorisé à consulter cet article');
  });

  // Test pour mettre à jour un article
  it('should update an article for the owner', async () => {
    const createArticleRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nom: 'Old Name', description: 'Old Desc', prix: 50, quantiteStock: 5 });
    const articleId = createArticleRes.body._id;

    const res = await request(app)
      .put(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nom: 'New Name', description: 'New Desc', prix: 60, quantiteStock: 6 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.nom).toEqual('New Name');
    expect(res.body.description).toEqual('New Desc');
  });

  // Test pour ne pas mettre à jour un article qui n'appartient pas au client
  it('should not update an article if not the owner', async () => {
    const otherClientRes = await request(app)
      .post('/api/clients/')
      .send({
        nom: 'OtherUpdate',
        prenom: 'User',
        email: 'other.update@example.com',
        motDePasse: 'otherpassword',
      });
    const otherAuthToken = otherClientRes.body.token;

    const createArticleRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nom: 'Update Article', description: 'Desc', prix: 70, quantiteStock: 7 });
    const articleId = createArticleRes.body._id;

    const res = await request(app)
      .put(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${otherAuthToken}`)
      .send({ nom: 'Attempted Update' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Non autorisé à modifier cet article');
  });

  // Test pour supprimer un article
  it('should delete an article for the owner', async () => {
    const createArticleRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nom: 'Delete Article', description: 'Desc', prix: 80, quantiteStock: 8 });
    const articleId = createArticleRes.body._id;

    const res = await request(app)
      .delete(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Article supprimé avec succès');

    // Vérifie que l'article a bien été supprimé
    const fetchRes = await request(app)
      .get(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(fetchRes.statusCode).toEqual(404);
  });

  // Test pour ne pas supprimer un article qui n'appartient pas au client
  it('should not delete an article if not the owner', async () => {
    const otherClientRes = await request(app)
      .post('/api/clients/')
      .send({
        nom: 'OtherDelete',
        prenom: 'User',
        email: 'other.delete@example.com',
        motDePasse: 'otherpassword',
      });
    const otherAuthToken = otherClientRes.body.token;

    const createArticleRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nom: 'Delete Attempt', description: 'Desc', prix: 90, quantiteStock: 9 });
    const articleId = createArticleRes.body._id;

    const res = await request(app)
      .delete(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${otherAuthToken}`);
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Non autorisé à supprimer cet article');
  });
});
