import { fetchApi } from './api';
import { AuthResponse } from '../types';

export const login = async (credentials: any): Promise<AuthResponse> => {
  return fetchApi<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const register = async (userData: any): Promise<AuthResponse> => {
  return fetchApi<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};
