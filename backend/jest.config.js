// Fichier: backend/jest.config.js

module.exports = {
  testEnvironment: 'node', // Spécifie l'environnement de test comme Node.js
  setupFilesAfterEnv: [], // Peut être utilisé pour configurer des choses avant chaque test
  testTimeout: 10000, // Augmente le timeout par défaut à 10 secondes
  // Vous pouvez ajouter d'autres configurations ici si nécessaire
  // Par exemple, pour ignorer certains dossiers:
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  // Pour collecter la couverture de code:
  collectCoverage: false,
  coverageDirectory: 'coverage',
};
