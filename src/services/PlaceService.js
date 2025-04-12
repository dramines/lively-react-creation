
import { getApiUrlSync, ENDPOINTS } from '../config/apiConfig';
import { calculateDistance } from '../../common/calculateDistance';
import { API_URL } from '../config/apiConfig';
export const searchPlaces = async (query, userLocation = null) => {
  try {
    if (!query || query.trim() === '') {
      return [];
    }
    
    const url = getApiUrlSync(ENDPOINTS.PLACES);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP! statut: ${response.status}`);
    }
    
    const result = await response.json();
    let places = result.data || [];
    
    // Filter places by name or description containing the query
    places = places.filter(place => 
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      (place.description && place.description.toLowerCase().includes(query.toLowerCase()))
    );

    // Calculate distances if user location is available
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      places = places.map(place => {
        const placeCoords = place.coordinates || place.location || {};
        const latitude = placeCoords.latitude;
        const longitude = placeCoords.longitude;
        
        if (latitude && longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            latitude,
            longitude
          );
          return { ...place, distance };
        }
        return place;
      });
      
      // Sort places by distance
      places.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }
    
    return places;
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
};

export const getPlaceDetails = async (placeId) => {
  try {
    const url = `${API_URL}/places/${placeId}`;
    console.log('Fetching place details from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP! statut: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching place with ID ${placeId}:`, error);
    throw error;
  }
};

export const getPlacesNearby = async (userLocation, maxDistance = 50) => {
  try {
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      throw new Error('User location is required');
    }
    
    const url = getApiUrlSync(ENDPOINTS.PLACES);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP! statut: ${response.status}`);
    }
    
    const result = await response.json();
    let places = result.data || [];
    
    // Calculate distance for each place
    places = places.map(place => {
      const placeCoords = place.coordinates || place.location || {};
      const latitude = placeCoords.latitude;
      const longitude = placeCoords.longitude;
      
      if (latitude && longitude) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          latitude,
          longitude
        );
        return { ...place, distance };
      }
      return { ...place, distance: null };
    });
    
    // Filter out places without distance or beyond maxDistance
    places = places
      .filter(place => place.distance !== null && place.distance <= maxDistance)
      .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    
    return places;
  } catch (error) {
    console.error('Error fetching places nearby:', error);
    return [];
  }
};
