import apiClient from './client';
import { API_ROUTES } from '../utils/constants';
import { CVAnalysisResponse, JDMatchResponse } from '../types';

export const analyseCV = async (cvId: string): Promise<CVAnalysisResponse> => {
  const res = await apiClient.post(API_ROUTES.ANALYSIS(cvId).ANALYSE);
  return res.data;
};

export const fetchAnalysisHistory = async (cvId: string): Promise<CVAnalysisResponse[]> => {
  const res = await apiClient.get(API_ROUTES.ANALYSIS(cvId).HISTORY);
  return res.data;
};

export const matchJD = async (cvId: string, jobDescription: string): Promise<JDMatchResponse> => {
  const res = await apiClient.post(API_ROUTES.ANALYSIS(cvId).MATCH_JD, { job_description: jobDescription });
  return res.data;
};
