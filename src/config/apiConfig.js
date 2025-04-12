
// Configuration de l'API avec l'adresse IP statique
// API Configuration with static IP address

// URL API statique (pas de détection dynamique)
// Static API URL (no dynamic detection)
const DEFAULT_API_URL = 'http://192.168.1.28:3000/api';
export const API_URL = DEFAULT_API_URL;

// Points de terminaison de l'API pour le développement
// Development API endpoints
export const ENDPOINTS = {
  // Points de terminaison pour les utilisateurs
  // User endpoints
  USERS: '/users',
  LOGIN: '/users/login', // Connexion utilisateur / User login
  REGISTER: '/users/register', // Inscription utilisateur / User registration
  USER_BY_ID: (id) => `/users/${id}`, // Obtenir un utilisateur par ID / Get user by ID
  ALL_USERS: '/users', // Tous les utilisateurs / All users
  
  // Points de terminaison pour la réinitialisation du mot de passe
  // Password reset endpoints
  FORGOT_PASSWORD: '/password/forgot', // Mot de passe oublié / Forgot password
  RESET_PASSWORD: '/password/reset', // Réinitialiser le mot de passe / Reset password
  
  // Points de terminaison pour les lieux
  // Places endpoints
  PLACES: '/places', // Tous les lieux / All places
  PLACE_BY_ID: (id) => `/places/${id}`, // Obtenir un lieu par ID / Get place by ID
  ADD_PLACE: '/places', // Ajouter un nouveau lieu / Add new place
  PLACES_BY_PROVIDER: (providerId) => `/places/provider/${providerId}`, // Lieux par prestataire / Places by provider
  UPDATE_PLACE: (id) => `/places/${id}`, // Mettre à jour un lieu / Update place
  DELETE_PLACE: (id) => `/places/${id}`, // Supprimer un lieu / Delete place
  
  // Points de terminaison pour les avis
  // Reviews endpoints
  REVIEWS: '/reviews', // Tous les avis / All reviews
  REVIEWS_BY_PLACE: (placeId) => `/reviews/place/${placeId}`, // Avis par lieu / Reviews by place
  REVIEWS_BY_USER: (userId) => `/reviews/user/${userId}`, // Avis par utilisateur / Reviews by user
  REVIEW_BY_ID: (id) => `/reviews/${id}`, // Obtenir un avis par ID / Get review by ID
  ADD_REVIEW: '/reviews', // Ajouter un nouvel avis / Add new review
  UPDATE_REVIEW: (id) => `/reviews/${id}`, // Mettre à jour un avis / Update review
  DELETE_REVIEW: (id) => `/reviews/${id}`, // Supprimer un avis / Delete review
};

// Fonction utilitaire pour construire l'URL API complète (simplifiée)
// Helper function to build full API URL (simplified)
export const getApiUrl = (endpoint) => `${API_URL}${endpoint}`;

// Pour la compatibilité avec le code existant
// For backward compatibility with existing code
export const getApiUrlSync = (endpoint) => `${API_URL}${endpoint}`;

// Exporter la fonction pour une utilisation future potentielle, mais la faire simplement renvoyer l'URL statique
// Export the function for potential future use but make it just return the static URL
export const getBaseApiUrl = () => DEFAULT_API_URL;

// Console.log pour le debug
// Pour utiliser l'API avec Postman:
// To use the API with Postman:
// 1. POST http://localhost:3000/api/places
// 2. Header: Content-Type: application/json
// 3. Body: JSON avec les détails du lieu / JSON with place details
console.log('API URL configurée:', API_URL);
