
import axios from 'axios';
import { UserData, RegistrationRequest, SaisonData } from '../types/users';

export const fetchUsers = async (): Promise<UserData[]> => {
  console.log('Fetching users...');
  const response = await axios.get('https://plateform.draminesaid.com/app/get_usersnew.php', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  if (!response.data.success) {
    throw new Error('Failed to fetch users');
  }
  
  return response.data.users;
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
