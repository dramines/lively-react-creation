
export const signupUser = async (userData) => {
  try {
    const response = await fetch('http://192.168.1.81:5002/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_user: userData.email,
        firstname_user: userData.firstname,
        lastname_user: userData.lastname,
        name_user: `${userData.firstname} ${userData.lastname}`,
        password_user: userData.password,
        country_user: userData.country,
        image_user: 'null',
        auth_method_user: 'normal',
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};
