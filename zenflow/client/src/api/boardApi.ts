import api from './axiosConfig'; 
import type {  IBoard, IBoardSummary } from '../types'; 

export const getMyBoards = async (): Promise<IBoardSummary[]> => {
  const { data } = await api.get('/api/board');
  return data;
};

export const getBoardById = async (boardId: string): Promise<IBoard> => {
  const { data } = await api.get(`/api/board/${boardId}`);
  return data;
};

export const createBoard = async (name: string): Promise<IBoard> => {
  const { data } = await api.post('/api/board', { name });
  return data;
};

export const inviteUserToBoard = async (boardId: string, email: string): Promise<void> => {
  await api.post(`/api/board/${boardId}/invite`, { email });
};