import apiClient from './client';
import { API_ROUTES } from '../utils/constants';
import { CVDocument } from '../types';

export const fetchCVs = async (): Promise<CVDocument[]> => {
  const res = await apiClient.get(API_ROUTES.CVS.BASE);
  return res.data;
};

export const uploadCV = async (file: File): Promise<CVDocument> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post(API_ROUTES.CVS.UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deleteCV = async (cvId: string): Promise<void> => {
  await apiClient.delete(`${API_ROUTES.CVS.BASE}/${cvId}`);
};
