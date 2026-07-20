import apiClient from './client';
import { API_ROUTES } from '../utils/constants';
import { ChatHistoryResponse, ChatMessage } from '../types';

export const fetchChatHistory = async (cvId: string): Promise<ChatHistoryResponse> => {
  const res = await apiClient.get(API_ROUTES.CHAT(cvId).HISTORY);
  return res.data;
};

export const sendChatMessage = async (cvId: string, content: string): Promise<ChatMessage> => {
  const res = await apiClient.post(API_ROUTES.CHAT(cvId).MESSAGE, { content });
  return res.data;
};

export const clearChatHistory = async (cvId: string): Promise<void> => {
  await apiClient.delete(API_ROUTES.CHAT(cvId).CLEAR);
};
