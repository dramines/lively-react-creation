
const Reservation = require("../models/reservationModel");
const Place = require("../models/placeModel");
const Event = require("../models/eventModel");
const { validationResult } = require("express-validator");

// Obtenir toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.getAll(req.query);
    res.status(200).json({
      status: 200,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir une réservation par ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.getById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    res.status(200).json({
      status: 200,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer une nouvelle réservation
exports.createReservation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Calcul du prix total
    const reservationData = { ...req.body };
    
    if (reservationData.eventId && reservationData.numberOfTickets) {
      const event = await Event.getById(reservationData.eventId);
      if (!event) {
        return res.status(404).json({ message: "Événement non trouvé" });
      }
      reservationData.totalPrice = event.ticketPrice * reservationData.numberOfTickets;
    }
    
    if (reservationData.placeId && reservationData.numberOfPersons) {
      const place = await Place.getById(reservationData.placeId);
      if (!place) {
        return res.status(404).json({ message: "Lieu non trouvé" });
      }
      let entranceFee = 10; // Valeur par défaut
      if (place.entranceFee) {
        try {
          const fees = JSON.parse(place.entranceFee);
          entranceFee = fees.adult || entranceFee;
        } catch (e) {
          // Utiliser la valeur par défaut si le parsing échoue
        }
      }
      reservationData.totalPrice = entranceFee * reservationData.numberOfPersons;
    }

    const reservationId = await Reservation.create(reservationData);
    const reservation = await Reservation.getById(reservationId);
    
    res.status(201).json({
      status: 201,
      message: "Réservation créée avec succès",
      data: reservation
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour une réservation
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.getById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    await Reservation.update(req.params.id, req.body);
    const updatedReservation = await Reservation.getById(req.params.id);
    
    res.status(200).json({
      status: 200,
      message: "Réservation mise à jour avec succès",
      data: updatedReservation
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.getById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    await Reservation.delete(req.params.id);
    res.status(204).json({
      status: 204,
      message: "Réservation supprimée avec succès"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vérifier la disponibilité
exports.checkAvailability = async (req, res) => {
  try {
    const { entityType, entityId, date, numberOfTickets } = req.query;
    
    if (!entityType || !entityId) {
      return res.status(400).json({ message: "Type d'entité et ID requis" });
    }
    
    const isAvailable = await Reservation.checkAvailability(
      entityType,
      entityId,
      date || null,
      numberOfTickets || 1
    );
    
    res.json({ available: isAvailable });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
