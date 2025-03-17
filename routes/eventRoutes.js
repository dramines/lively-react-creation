
/**
 * Event Routes - Handles all event-related API endpoints
 * 
 * These routes handle the creation, retrieval, updating, and deletion
 * of events, including filtering for upcoming events.
 */
const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents
} = require("../controllers/eventController");
const { protect, admin } = require("../middleware/auth");
const { eventValidation, idValidation } = require("../middleware/validate");

// Public Routes

/**
 * @route   GET /api/events
 * @desc    Get all events with optional filtering
 * @access  Public
 * @query   Various filter parameters
 * @returns Array of events
 */
router.get("/", getAllEvents);

/**
 * @route   GET /api/events/upcoming
 * @desc    Get upcoming events
 * @access  Public
 * @query   {limit} - Number of events to return
 * @returns Array of upcoming events
 */
router.get("/upcoming", getUpcomingEvents);

/**
 * @route   GET /api/events/:id
 * @desc    Get event by ID
 * @access  Public
 * @param   id - Event ID
 * @returns Event data
 */
router.get("/:id", idValidation, getEventById);

// Protected Routes

/**
 * @route   POST /api/events
 * @desc    Create a new event
 * @access  Private - Requires authentication (admin)
 * @body    Event data
 * @returns Created event data
 */
router.post("/", protect, admin, eventValidation, createEvent);

/**
 * @route   PUT /api/events/:id
 * @desc    Update an event
 * @access  Private - Requires authentication (admin)
 * @param   id - Event ID
 * @body    Updated event data
 * @returns Updated event data
 */
router.put("/:id", protect, admin, idValidation, eventValidation, updateEvent);

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete an event
 * @access  Private - Requires authentication (admin)
 * @param   id - Event ID
 * @returns Success message
 */
router.delete("/:id", protect, admin, idValidation, deleteEvent);

module.exports = router;
