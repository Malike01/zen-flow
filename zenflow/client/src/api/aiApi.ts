import type { ITag } from '../types';
import api from './axiosConfig';

type SubtaskResponse = string[];

export const generateSubtasks = async (title: string): Promise<SubtaskResponse> => {
  const { data } = await api.post('/api/ai/generate-subtasks', { title });
  return data;
};

export const generateDescription = async (title: string): Promise<{ description: string }> => {
  const { data } = await api.post('/api/ai/generate-description', { title });
  return data; 
};

export const suggestTags = async (payload: { title: string; description: string }): Promise<ITag[]> => {
  const { data } = await api.post('/api/ai/suggest-tags', payload);
  return data; 
};