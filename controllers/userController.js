const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un utilisateur spécifique
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register User (Inscription)
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user with this email already exists
    const existingUser = await User.findByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const userId = await User.create(req.body);
    res.status(201).json({ 
      message: "Utilisateur créé avec succès", 
      userId,
      success: true 
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: error.message });
  }
};

// Login User (Connexion)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      // Set session data
      req.session.userId = user.user_id;
      req.session.role = user.role;

      res.json({
        user: {
          id: user.user_id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ message: "Identifiants invalides" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout User (Déconnexion)
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Échec de la déconnexion" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Déconnecté avec succès" });
  });
};

// Get Current User (Récupérer l'utilisateur actuel)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User (Mettre à jour un utilisateur)
exports.updateUser = async (req, res) => {
  try {
    const userExists = await User.findById(req.params.id);
    if (!userExists) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Removing security checks as requested
    await User.update(req.params.id, req.body);
    res.json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete User (Supprimer un utilisateur)
exports.deleteUser = async (req, res) => {
  try {
    const userExists = await User.findById(req.params.id);
    if (!userExists) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Removing security checks as requested
    await User.delete(req.params.id);
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
