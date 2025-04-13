
const express = require("express");
const router = express.Router();
const {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/placeController");
const { protect, admin } = require("../middleware/auth");
const { placeValidation, idValidation } = require("../middleware/validate");

// Public routes - No authentication required
router.get("/", getAllPlaces);
router.get("/:id", idValidation, getPlaceById);

// Public routes for creating, updating, and deleting - No authentication required
router.post("/", placeValidation, createPlace);
router.put("/:id", idValidation, placeValidation, updatePlace);
router.delete("/:id", idValidation, deletePlace);

module.exports = router;
