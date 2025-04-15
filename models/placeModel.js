/**
 * Module de gestion des lieux dans la base de données
 * Gère toutes les opérations CRUD pour les lieux touristiques et points d'intérêt
 * Assure la persistance et la récupération des données liées aux lieux
 */
const db = require("../config/db");

/**
 * Classe Place qui gère toutes les opérations sur les lieux
 * Fournit une interface entre l'API et la base de données
 */
class Place {
  /**
   * Récupère tous les lieux enregistrés
   * @returns {Promise<Array>} Liste complète des lieux avec leurs détails
   */
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM places");
    return rows;
  }

  /**
   * Récupère un lieu spécifique par son ID
   * @param {number} id - ID du lieu à récupérer
   * @returns {Promise<Object|null>} Le lieu trouvé ou null
   */
  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM places WHERE place_id = ?", [
      id,
    ]);
    return rows[0];
  }

  /**
   * Crée un nouveau lieu dans la base de données
   * @param {Object} placeData - Données du lieu à créer
   * @returns {Promise<number>} ID du nouveau lieu créé
   */
  static async create(placeData) {
    const [result] = await db.query(
      `INSERT INTO places 
      (nom_place, description, location, longitude, latitude, url_img, url_web)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        placeData.nom_place,
        placeData.description,
        placeData.location,
        placeData.longitude,
        placeData.latitude,
        placeData.url_img,
        placeData.url_web,
      ]
    );
    return result.insertId;
  }

  /**
   * Met à jour les informations d'un lieu existant
   * @param {number} id - ID du lieu à mettre à jour
   * @param {Object} updates - Nouvelles données à appliquer
   * @returns {Promise<void>} Aucun retour
   */
  static async update(id, updates) {
    const fields = Object.keys(updates).join(" = ?, ") + " = ?";
    const values = Object.values(updates);

    await db.query(`UPDATE places SET ${fields} WHERE place_id = ?`, [
      ...values,
      id,
    ]);
  }

  /**
   * Supprime un lieu de la base de données
   * @param {number} id - ID du lieu à supprimer
   * @returns {Promise<void>} Aucun retour
   */
  static async delete(id) {
    await db.query("DELETE FROM places WHERE place_id = ?", [id]);
  }
}

module.exports = Place;
