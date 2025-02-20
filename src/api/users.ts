import axios from 'axios';
import { UserData, RegistrationRequest, SaisonData } from '../types/users';

const api = axios.create({
  baseURL: 'https://plateform.draminesaid.com/app',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const fetchUsers = async (): Promise<UserData[]> => {
  console.log('Fetching users...');
  try {
    const response = await api.get('/get_usersnew.php', {
      timeout: 30000, // 30 second timeout
    });
    
    if (!response.data.success) {
      throw new Error('Failed to fetch users');
    }
    
    // Pre-sort data on the client to avoid repeated sorting
    const sortedUsers = response.data.users.sort((a: UserData, b: UserData) => 
      b.user.id_client.localeCompare(a.user.id_client)
    );
    
    return sortedUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchRegistrationRequests = async (): Promise<RegistrationRequest[]> => {
  console.log('Fetching registration requests...');
  const response = await axios.get('https://plateform.draminesaid.com/app/request_usersnew.php', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  if (response.data.success) {
    return response.data.requests || [];
  }
  throw new Error('Failed to fetch registration requests');
};

export const fetchSaisons = async (): Promise<SaisonData[]> => {
  const response = await axios.get('https://plateform.draminesaid.com/app/get_saisons.php');
  if (response.data.success) {
    return response.data.saisons;
  }
  throw new Error('Failed to fetch saisons');
};
