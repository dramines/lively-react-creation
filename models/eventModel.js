
/**
 * Event Model - Handles all database operations for events
 * 
 * This model provides methods for CRUD operations on events data
 * including filtering, sorting, and related data operations.
 * 
 * @module models/eventModel
 */
const db = require("../config/db");

class Event {
  /**
   * Get all events with optional filters
   * 
   * @param {Object} filters - Optional filters for query
   * @param {string} filters.location - Filter by location (partial match)
   * @param {string} filters.organizer - Filter by organizer
   * @param {Date} filters.startDate - Filter by events after this date
   * @param {Date} filters.endDate - Filter by events before this date
   * @param {number} filters.place_id - Filter by place ID
   * @param {number} filters.limit - Maximum number of results to return
   * @param {string} filters.sortBy - Field to sort by (default: startDate)
   * @param {string} filters.sortOrder - Sort order ('ASC' or 'DESC')
   * @returns {Promise<Array>} - Promise resolving to array of events
   */
  static async getAll(filters = {}) {
    let query = "SELECT * FROM events WHERE 1=1";
    const params = [];

    // Filter by location
    if (filters.location) {
      query += " AND location LIKE ?";
      params.push(`%${filters.location}%`);
    }

    // Filter by organizer
    if (filters.organizer) {
      query += " AND organizer = ?";
      params.push(filters.organizer);
    }

    // Filter by provider_id
    if (filters.provider_id) {
      query += " AND provider_id = ?";
      params.push(filters.provider_id);
    }

    // Filter by date range
    if (filters.startDate) {
      query += " AND startDate >= ?";
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += " AND endDate <= ?";
      params.push(filters.endDate);
    }

    // Sort by specified field or default to startDate
    const sortField = filters.sortBy || 'startDate';
    const sortOrder = filters.sortOrder && filters.sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    // Apply limit if specified
    if (filters.limit && parseInt(filters.limit) > 0) {
      query += " LIMIT ?";
      params.push(parseInt(filters.limit));
    }

    try {
      const [rows] = await db.query(query, params);
      return rows.map(event => formatEventData(event));
    } catch (error) {
      console.error("Database error in getAll events:", error);
      throw new Error(`Failed to retrieve events: ${error.message}`);
    }
  }

  /**
   * Get an event by its ID
   * 
   * @param {number} id - Event ID
   * @returns {Promise<Object|null>} - Promise resolving to event or null if not found
   */
  static async getById(id) {
    try {
      const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
      if (rows.length === 0) return null;
      return formatEventData(rows[0]);
    } catch (error) {
      console.error("Database error in getById event:", error);
      throw new Error(`Failed to retrieve event: ${error.message}`);
    }
  }

  /**
   * Create a new event
   * 
   * @param {Object} eventData - Event data to insert
   * @param {string} eventData.title - Event title (required)
   * @param {string} eventData.description - Event description (required)
   * @param {string|Date} eventData.startDate - Event start date and time (required)
   * @param {string|Date} eventData.endDate - Event end date and time (required)
   * @param {string} eventData.location - Event location (required)
   * @param {string} [eventData.organizer] - Event organizer
   * @param {number} [eventData.ticketPrice] - Event ticket price
   * @param {number} [eventData.capacity] - Event maximum capacity
   * @param {Array|string} [eventData.images] - Event images (array or JSON string)
   * @param {number} [eventData.provider_id] - Provider user ID
   * @returns {Promise<number>} - Promise resolving to inserted ID
   */
  static async create(eventData) {
    // Validate required fields
    if (!eventData.title) throw new Error("Title is required");
    if (!eventData.description) throw new Error("Description is required");
    if (!eventData.startDate) throw new Error("Start date is required");
    if (!eventData.endDate) throw new Error("End date is required");
    if (!eventData.location) throw new Error("Location is required");

    // Validate dates
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.endDate);
    
    if (isNaN(startDate.getTime())) throw new Error("Invalid start date format");
    if (isNaN(endDate.getTime())) throw new Error("Invalid end date format");
    if (endDate <= startDate) throw new Error("End date must be after start date");

    // Process images - ensure it's stored as JSON
    let images = eventData.images || [];
    if (!Array.isArray(images)) {
      try {
        if (typeof images === 'string') {
          images = JSON.parse(images);
        } else {
          images = [];
        }
      } catch (e) {
        images = [];
      }
    }

    try {
      const [result] = await db.query(
        `INSERT INTO events 
        (title, description, startDate, endDate, location, organizer, 
         ticketPrice, capacity, images, provider_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          eventData.title,
          eventData.description,
          eventData.startDate,
          eventData.endDate,
          eventData.location,
          eventData.organizer || null,
          eventData.ticketPrice || null,
          eventData.capacity || null,
          JSON.stringify(images),
          eventData.provider_id || null,
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error("Database error in create event:", error);
      throw new Error(`Failed to create event: ${error.message}`);
    }
  }

  /**
   * Update an existing event
   * 
   * @param {number} id - Event ID to update
   * @param {Object} updates - Object with fields to update
   * @returns {Promise<void>}
   */
  static async update(id, updates) {
    // Validate dates if provided
    if (updates.startDate && updates.endDate) {
      const startDate = new Date(updates.startDate);
      const endDate = new Date(updates.endDate);
      
      if (isNaN(startDate.getTime())) throw new Error("Invalid start date format");
      if (isNaN(endDate.getTime())) throw new Error("Invalid end date format");
      if (endDate <= startDate) throw new Error("End date must be after start date");
    } else if (updates.startDate || updates.endDate) {
      // If only one date is provided, we need to compare with the existing date
      const existingEvent = await this.getById(id);
      if (!existingEvent) throw new Error("Event not found");
      
      const startDate = new Date(updates.startDate || existingEvent.startDate);
      const endDate = new Date(updates.endDate || existingEvent.endDate);
      
      if (endDate <= startDate) throw new Error("End date must be after start date");
    }

    // Process images if provided
    if (updates.images) {
      if (Array.isArray(updates.images)) {
        updates.images = JSON.stringify(updates.images);
      } else if (typeof updates.images === 'string' && !updates.images.startsWith('[')) {
        // Convert single image string to JSON array
        updates.images = JSON.stringify([updates.images]);
      }
    }

    // Build the update query dynamically
    const fields = Object.keys(updates);
    if (fields.length === 0) throw new Error("No fields to update");
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);

    try {
      await db.query(`UPDATE events SET ${setClause} WHERE id = ?`, [
        ...values,
        id,
      ]);
    } catch (error) {
      console.error("Database error in update event:", error);
      throw new Error(`Failed to update event: ${error.message}`);
    }
  }

  /**
   * Delete an event
   * 
   * @param {number} id - Event ID to delete
   * @returns {Promise<void>}
   */
  static async delete(id) {
    try {
      await db.query("DELETE FROM events WHERE id = ?", [id]);
    } catch (error) {
      console.error("Database error in delete event:", error);
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  }

  /**
   * Get upcoming events
   * 
   * @param {number} limit - Maximum number of events to return
   * @returns {Promise<Array>} - Promise resolving to array of upcoming events
   */
  static async getUpcomingEvents(limit = 10) {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    try {
      const [rows] = await db.query(
        `SELECT * FROM events 
        WHERE startDate > ? 
        ORDER BY startDate ASC LIMIT ?`,
        [now, limit]
      );
      return rows.map(event => formatEventData(event));
    } catch (error) {
      console.error("Database error in getUpcomingEvents:", error);
      throw new Error(`Failed to retrieve upcoming events: ${error.message}`);
    }
  }

  /**
   * Get events by place ID
   * 
   * @param {number} placeId - Place ID to filter by
   * @returns {Promise<Array>} - Promise resolving to array of events
   */
  static async getByPlaceId(placeId) {
    try {
      const [rows] = await db.query(
        `SELECT e.* FROM events e
        JOIN places p ON e.location = p.name 
        WHERE p.id = ? 
        ORDER BY e.startDate ASC`,
        [placeId]
      );
      return rows.map(event => formatEventData(event));
    } catch (error) {
      console.error("Database error in getByPlaceId:", error);
      throw new Error(`Failed to retrieve events by place ID: ${error.message}`);
    }
  }

  /**
   * Get events by provider ID
   * 
   * @param {number} providerId - Provider ID to filter by
   * @returns {Promise<Array>} - Promise resolving to array of events
   */
  static async getByProviderId(providerId) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM events 
        WHERE provider_id = ?
        ORDER BY startDate ASC`,
        [providerId]
      );
      return rows.map(event => formatEventData(event));
    } catch (error) {
      console.error("Database error in getByProviderId:", error);
      throw new Error(`Failed to retrieve events by provider ID: ${error.message}`);
    }
  }
}

/**
 * Format event data for consistency
 * 
 * @param {Object} event - Raw event data from database
 * @returns {Object} - Formatted event data
 */
function formatEventData(event) {
  if (!event) return null;
  
  // Parse images JSON if it's a string
  if (event.images && typeof event.images === 'string') {
    try {
      event.images = JSON.parse(event.images);
    } catch (e) {
      event.images = [];
    }
  }

  return event;
}

module.exports = Event;
