// Importation de la connexion à la base de données depuis le fichier de configuration
const db = require("../config/db");
// Importation de la bibliothèque bcryptjs pour le hachage des mots de passe
const bcrypt = require("bcryptjs");

// Définition de la classe User qui gère les opérations liées aux utilisateurs
class User {
  // Méthode statique pour récupérer tous les utilisateurs (sans mot de passe)
  static async findAll() {
    const [rows] = await db.query(
      "SELECT user_id, nom, prenom, email, role FROM users"
    );
    return rows; // Retourne tous les utilisateurs
  }

  // Méthode statique pour créer un nouvel utilisateur
  static async create(userData) {
    // Hachage du mot de passe fourni par l'utilisateur
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Insertion du nouvel utilisateur dans la base de données
    const [result] = await db.query(
      `INSERT INTO users 
      (nom, prenom, email, password_hash, role) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        userData.nom,
        userData.prenom,
        userData.email,
        hashedPassword, // mot de passe haché
        userData.role || "user", // par défaut, le rôle est "user"
      ]
    );

    return result.insertId; // Retourne l'ID du nouvel utilisateur
  }

  // Méthode statique pour rechercher un utilisateur par email (utile pour la connexion)
  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0]; // Retourne le premier utilisateur trouvé
  }

  // Méthode statique pour rechercher un utilisateur par son ID
  static async findById(id) {
    const [rows] = await db.query(
      "SELECT user_id, nom, prenom, email, role FROM users WHERE user_id = ?",
      [id]
    );
    return rows[0]; // Retourne l'utilisateur correspondant
  }

  // Méthode statique pour mettre à jour les informations d'un utilisateur
  static async update(id, updates) {
    // Si un nouveau mot de passe est fourni, on le hache
    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 10);
      delete updates.password; // On supprime l'ancien champ "password" non haché
    }

    // Si aucun champ n’est fourni pour la mise à jour, on arrête ici
    if (Object.keys(updates).length === 0) {
      return;
    }

    // Construction dynamique de la requête SQL
    // Exemple : "nom = ?, prenom = ?, email = ?"
    const fields = Object.keys(updates).join(" = ?, ") + " = ?";
    const values = Object.values(updates);

    // Exécution de la requête de mise à jour
    await db.query(`UPDATE users SET ${fields} WHERE user_id = ?`, [
      ...values,
      id,
    ]);
  }

  // Méthode statique pour supprimer un utilisateur par son ID
  static async delete(id) {
    await db.query("DELETE FROM users WHERE user_id = ?", [id]);
  }
}

// Exportation de la classe User pour l'utiliser dans d'autres fichiers
module.exports = User;
