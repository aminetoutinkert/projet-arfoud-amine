// Fichier: backend/tests/article.test.js

require('dotenv').config(); // Charge les variables d'environnement du fichier .env

const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Client = require('../models/Client');
const Article = require('../models/Article');

// Connexion à la base de données de test
beforeAll(async () => {
  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) {
    throw new Error('MONGODB_URI is not defined in .env. Please provide it for tests.');
  }
  const testDbName = 'arfoud_article_test';
  const uri = baseUri.substring(0, baseUri.lastIndexOf('/') + 1) + testDbName;
  await mongoose.connect(uri);
});

// Nettoyage après chaque test
afterEach(async () => {
  await Article.deleteMany({});
  await Client.deleteMany({});
});

// Déconnexion après tous les tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Article API', () => {
  // Fonction utilitaire pour créer un client et obtenir un token
  const createClientAndGetToken = async (email = 'test@example.com') => {
    const res = await request(app)
      .post('/api/clients/')
      .send({
        nom: 'Test',
        prenom: 'User',
        email,
        motDePasse: 'password123',
      });
    return { token: res.body.token, clientId: res.body._id };
  };

  it('should create a new article for the authenticated client', async () => {
    const { token, clientId } = await createClientAndGetToken();
    const res = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nom: 'Test Article',
        description: 'Description for test article',
        prix: 100,
        quantiteStock: 10,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.nom).toEqual('Test Article');
    expect(res.body.client.toString()).toEqual(clientId);
  });

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
  });

  it('should get all articles for the authenticated client', async () => {
    const { token } = await createClientAndGetToken();
    await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({ nom: 'Article 1', description: 'Desc 1', prix: 10, quantiteStock: 1 });
    await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({ nom: 'Article 2', description: 'Desc 2', prix: 20, quantiteStock: 2 });

    const res = await request(app)
      .get('/api/articles')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
  });

  it('should get a single article by ID for the owner', async () => {
    const { token } = await createClientAndGetToken();
    const createArticleRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({ nom: 'Single Article', description: 'Desc', prix: 30, quantiteStock: 3 });
    const articleId = createArticleRes.body._id;

    const res = await request(app)
      .get(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.nom).toEqual('Single Article');
  });

  it('should not get a single article if not the owner', async () => {
    const { token: ownerToken } = await createClientAndGetToken('owner@example.com');
    const { token: otherToken } = await createClientAndGetToken('other@example.com');

    const createArticleRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ nom: 'Owned Article', description: 'Desc', prix: 40, quantiteStock: 4 });
    const articleId = createArticleRes.body._id;

    const res = await request(app)
      .get(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.statusCode).toEqual(401);
  });

  it('should update an article for the owner', async () => {
    const { token } = await createClientAndGetToken();
    const createArticleRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({ nom: 'Old Name', description: 'Old Desc', prix: 50, quantiteStock: 5 });
    const articleId = createArticleRes.body._id;

    const res = await request(app)
      .put(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nom: 'New Name' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.nom).toEqual('New Name');
  });

  it('should not update an article if not the owner', async () => {
    const { token: ownerToken } = await createClientAndGetToken('owner@example.com');
    const { token: otherToken } = await createClientAndGetToken('other@example.com');

    const createArticleRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ nom: 'Update Article', description: 'Desc', prix: 70, quantiteStock: 7 });
    const articleId = createArticleRes.body._id;

    const res = await request(app)
      .put(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ nom: 'Attempted Update' });
    expect(res.statusCode).toEqual(401);
  });

  it('should delete an article for the owner', async () => {
    const { token } = await createClientAndGetToken();
    const createArticleRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({ nom: 'Delete Article', description: 'Desc', prix: 80, quantiteStock: 8 });
    const articleId = createArticleRes.body._id;

    const res = await request(app)
      .delete(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);

    const fetchRes = await request(app)
      .get(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(fetchRes.statusCode).toEqual(404);
  });

  it('should not delete an article if not the owner', async () => {
    const { token: ownerToken } = await createClientAndGetToken('owner@example.com');
    const { token: otherToken } = await createClientAndGetToken('other@example.com');

    const createArticleRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ nom: 'Delete Attempt', description: 'Desc', prix: 90, quantiteStock: 9 });
    const articleId = createArticleRes.body._id;

    const res = await request(app)
      .delete(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.statusCode).toEqual(401);
  });
});

