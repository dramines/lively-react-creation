
/**
 * Middleware d'authentification
 * Ce fichier contient les fonctions de protection des routes nécessitant une authentification
 */

/**
 * Middleware pour protéger les routes nécessitant une authentification
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
const protect = (req, res, next) => {
  if (req.session && req.session.userId) {
    // L'utilisateur est authentifié
    next();
  } else {
    // L'utilisateur n'est pas authentifié
    res.status(401).json({ 
      success: false,
      message: "Vous devez être connecté pour accéder à cette ressource" 
    });
  }
};

/**
 * Middleware pour protéger les routes nécessitant des droits d'administrateur
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
const admin = (req, res, next) => {
  if (req.session && req.session.role === 'admin') {
    // L'utilisateur est un administrateur
    next();
  } else {
    // L'utilisateur n'a pas les droits d'administrateur
    res.status(403).json({ 
      success: false,
      message: "Accès refusé. Droits d'administrateur requis." 
    });
  }
};

/**
 * Middleware pour protéger les routes nécessitant des droits de propriétaire
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
const owner = (req, res, next) => {
  if (req.session && (req.session.role === 'admin' || req.session.role === 'owner')) {
    // L'utilisateur est un propriétaire ou administrateur
    next();
  } else {
    // L'utilisateur n'a pas les droits de propriétaire
    res.status(403).json({ 
      success: false,
      message: "Accès refusé. Droits de propriétaire requis." 
    });
  }
};

/**
 * Middleware pour vérifier si un utilisateur est authentifié et renvoyer son statut
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 */
const checkAuth = (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ 
      authenticated: true,
      userId: req.session.userId,
      role: req.session.role
    });
  } else {
    res.json({ authenticated: false });
  }
};

module.exports = { protect, admin, owner, checkAuth };
