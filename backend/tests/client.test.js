// Fichier: backend/tests/client.test.js

const request = require('supertest');
const app = require('../server'); // Assurez-vous que votre fichier server.js exporte l'application Express
const mongoose = require('mongoose');
const Client = require('../models/Client'); // Importez votre modèle Client

// Avant tous les tests, connectez-vous à une base de données de test
beforeAll(async () => {
  // Utilisez une base de données de test différente pour éviter de polluer la base de données de développement
  // Assurez-vous que MONGODB_URI_TEST est défini dans votre .env ou un fichier de configuration de test
  const uri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/arfoud_test';
  await mongoose.connect(uri);
});

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
