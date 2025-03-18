
import axios from 'axios';
import { UserData, RegistrationRequest, SaisonData, PaginatedResponse } from '../types/users';

export const fetchUsers = async (): Promise<UserData[]> => {
  console.log('Fetching all users for backward compatibility...');
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

export const fetchPaginatedUsers = async (
  page: number = 1,
  limit: number = 10,
  searchTerm: string = ''
): Promise<PaginatedResponse<UserData>> => {
  console.log(`Fetching users for page ${page} with limit ${limit}${searchTerm ? ' with search: ' + searchTerm : ''}...`);
  const response = await axios.get(`https://plateform.draminesaid.com/app/get_usersnew.php?page=${page}&limit=${limit}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  if (!response.data.success) {
    throw new Error('Failed to fetch users');
  }
  
  return {
    data: response.data.users,
    pagination: response.data.pagination
  };
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
