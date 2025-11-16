// Fichier: backend/tests/client.test.js

require('dotenv').config(); // Charge les variables d'environnement du fichier .env

const request = require('supertest');
const app = require('../server'); // Assurez-vous que votre fichier server.js exporte l'application Express
const mongoose = require('mongoose');
const Client = require('../models/Client'); // Importez votre modèle Client

// Avant tous les tests, connectez-vous à une base de données de test
beforeAll(async () => {
  // Utilisez la MONGODB_URI principale, mais avec un nom de base de données de test
  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) {
    throw new Error('MONGODB_URI is not defined in .env. Please provide it for tests.');
  }
  // Extrait le nom de la base de données de l'URI principale et ajoute '_test'
  const testDbName = 'arfoud_test'; // Nom de la base de données de test
  const uri = baseUri.substring(0, baseUri.lastIndexOf('/') + 1) + testDbName;

  console.log(`Attempting to connect to MongoDB at: ${uri}`); // Log the URI
  try {
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB for tests.');
  } catch (error) {
    console.error('Failed to connect to MongoDB for tests:', error);
    // Optionally, re-throw the error to fail the test suite immediately
    throw error;
  }
}, 30000); // Augmente le timeout de beforeAll à 30 secondes

// Après chaque test, nettoyez la base de données
afterEach(async () => {
  await Client.deleteMany({}); // Supprime tous les clients créés pendant le test
});

// Après tous les tests, déconnectez-vous de la base de données
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Client API', () => {
  it('should register a new client', async () => {
    const res = await request(app)
      .post('/api/clients/')
      .send({
        nom: 'Test',
        prenom: 'Client',
        email: 'test@example.com',
        motDePasse: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toEqual('test@example.com');
  });

  it('should not register a client with missing fields', async () => {
    const res = await request(app)
      .post('/api/clients/')
      .send({
        nom: 'Test',
        email: 'test2@example.com',
        motDePasse: 'password123',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Veuillez ajouter tous les champs requis');
  });

  it('should not register a client with an existing email', async () => {
    await request(app)
      .post('/api/clients/')
      .send({
        nom: 'Test',
        prenom: 'Client',
        email: 'existing@example.com',
        motDePasse: 'password123',
      });

    const res = await request(app)
      .post('/api/clients/')
      .send({
        nom: 'Test2',
        prenom: 'Client2',
        email: 'existing@example.com',
        motDePasse: 'password456',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Un client avec cet email existe déjà.');
  });

  it('should login an existing client', async () => {
    // D'abord, enregistrez un client
    await request(app)
      .post('/api/clients/')
      .send({
        nom: 'Login',
        prenom: 'Client',
        email: 'login@example.com',
        motDePasse: 'loginpassword',
      });

    // Ensuite, essayez de vous connecter
    const res = await request(app)
      .post('/api/clients/login')
      .send({
        email: 'login@example.com',
        motDePasse: 'loginpassword',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toEqual('login@example.com');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/clients/login')
      .send({
        email: 'nonexistent@example.com',
        motDePasse: 'wrongpassword',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Identifiants invalides (Email ou mot de passe incorrect).');
  });
});
