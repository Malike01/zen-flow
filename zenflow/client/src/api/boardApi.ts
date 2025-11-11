import api from './axiosConfig'; 
import type { BoardData, MoveTaskPayload } from '../types'; 

export const fetchBoard = async (): Promise<BoardData> => {
  const { data } = await api.get('/api/board');
  return data;
};

export const moveTask = async (payload: MoveTaskPayload): Promise<void> => {
  await api.put('/api/board/move', payload);
};