const fetchFoodDetails = async (foodId, signal) => {
  try {
    const response = await fetch(
      `http://192.168.1.81:5002/api/foods/${foodId}`,
      { signal }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch food details');
    }
    
    const data = await response.json();
    
    return {
      images: data.images.map(img => `http://192.168.1.81:5002/api/${img}`),
      title: data.name_food,
      description: data.description_food,
      foodtype: data.type_food,
      expiryDate: data.cookedtime_food ? new Date(data.cookedtime_food).toLocaleDateString() : "N/A",
      allergens: data.allergens_food === "true" ? [" Allergens"] : ["No Allergens"],
      preparation: `${data.quantity_food} ${data.quantitytype_food}`,
      quantitytype_food: data.quantitytype_food,
      actualquantity_food: data.actualquantity_food,
      additionalnote: data.additionalnote_food,
      hallal: data.hallal_food === 1 ? 'Halal' : 'Not Halal',
      isfrozen: data.isfrozen_food ? 'Frozen' : 'Fresh',
      hygienneDeclaration: data.hygienne_declaration ? 'Declared' : 'Not Declared',
      dataConsent: data.data_consent ? 'Given' : 'Not Given',
      userPosted: {
        name: data.user ? `${data.user.firstname_user} ${data.user.lastname_user}` : 'Unknown',
        date: data.createdate_food ? new Date(data.createdate_food).toLocaleDateString() : "N/A",
        country: data.user?.country_user || 'Unknown'
      },
      location: data.availability
        ? {
            address: data.availability.adresse_availability,
            country: data.availability.country_availability,
            postalCode: data.availability.postalcode_availability,
            date: data.availability.date_availability ? new Date(data.availability.date_availability).toLocaleDateString() : "N/A",
            time: data.availability.time_availability,
            longitude: data.availability.longitude_availability,
            altitude: data.availability.altitude_availability,
          }
        : null,
      status: data.istaken_food ? 'Reserved' : 'Available'
    };
  } catch (err) {
    throw err;
  }
};

export { fetchFoodDetails };