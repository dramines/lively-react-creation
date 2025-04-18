
/**
 * Routes des réservations - Gère tous les points d'accès API liés aux réservations
 * 
 * Ces routes gèrent la création, la récupération, la mise à jour et la suppression
 * des réservations, ainsi que la vérification de disponibilité.
 */
const express = require("express");
const router = express.Router();
const {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
  checkAvailability
} = require("../controllers/reservationController");
const { reservationValidation, idValidation } = require("../middleware/validate");

/**
 * @route   GET /api/reservations
 * @desc    Obtenir toutes les réservations
 * @access  Public
 * @returns Tableau de toutes les réservations
 */
router.get("/", getAllReservations);

/**
 * @route   GET /api/reservations/:id
 * @desc    Obtenir une réservation par son ID
 * @access  Public
 * @param   id - ID de la réservation
 * @returns Données de la réservation
 */
router.get("/:id", idValidation, getReservationById);

/**
 * @route   POST /api/reservations
 * @desc    Créer une nouvelle réservation
 * @access  Public
 * @body    Données de la réservation
 * @returns Réservation créée
 */
router.post("/", reservationValidation, createReservation);

/**
 * @route   PUT /api/reservations/:id
 * @desc    Mettre à jour une réservation
 * @access  Public
 * @param   id - ID de la réservation
 * @body    Données mises à jour
 * @returns Réservation mise à jour
 */
router.put("/:id", idValidation, updateReservation);

/**
 * @route   DELETE /api/reservations/:id
 * @desc    Supprimer une réservation
 * @access  Public
 * @param   id - ID de la réservation
 * @returns Message de confirmation
 */
router.delete("/:id", idValidation, deleteReservation);

/**
 * @route   GET /api/reservations/availability
 * @desc    Vérifier la disponibilité
 * @access  Public
 * @query   {entityType, entityId, date, numberOfTickets}
 * @returns Statut de disponibilité
 */
router.get("/availability", checkAvailability);

module.exports = router;
