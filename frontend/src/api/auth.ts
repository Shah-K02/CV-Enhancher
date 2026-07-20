import apiClient from './client';
import { API_ROUTES } from '../utils/constants';
import { TokenResponse, User } from '../types';

export const login = async (credentials: any): Promise<TokenResponse> => {
  const params = new URLSearchParams();
  params.append('username', credentials.email);
  params.append('password', credentials.password);
  
  const res = await apiClient.post(API_ROUTES.AUTH.LOGIN, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return res.data;
};

export const register = async (userData: any): Promise<User> => {
  const res = await apiClient.post(API_ROUTES.AUTH.REGISTER, userData);
  return res.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const res = await apiClient.get(API_ROUTES.AUTH.ME);
  return res.data;
};
