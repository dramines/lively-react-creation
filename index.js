/**
 * Point d'entrée principal de l'application JenCity
 * 
 * Ce fichier initialise le serveur Express et démarre l'application.
 */
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors/safe');

// Charger les variables d'environnement
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Journalisation des requêtes en développement
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root route handler
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Bienvenue sur l\'API JendoubaLife',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Routes API
const userRoutes = require('./routes/userRoutes');
const placeRoutes = require('./routes/placeRoutes');
const eventRoutes = require('./routes/eventRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const messagerieRoutes = require('./routes/messagerieRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

// Enregistrer les routes
app.use('/api/users', userRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/messagerie', messagerieRoutes);
app.use('/api/password', passwordRoutes);

// Servir la documentation API
app.use('/api-docs', express.static(path.join(__dirname, 'docs')));
app.use('/documentation', express.static(path.join(__dirname, 'documentation_api.html')));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err.stack);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

// Middleware pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Définir le port
const PORT = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`
  ╭────────────────────────────────────────────────╮
  │                                                │
  │   🚀 Serveur démarré sur le port ${PORT}           │
  │   🌐 http://localhost:${PORT}                      │
  │   📘 Documentation API: http://localhost:${PORT}/api-docs │
  │                                                │
  ╰────────────────────────────────────────────────╯
  `);
});

module.exports = app;
