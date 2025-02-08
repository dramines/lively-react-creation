export const fetchFoodItems = async () => {
    try {
      const response = await fetch('http://192.168.1.81:5002/api/foods');
      const data = await response.json();
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  };