import api from './axiosConfig';
import type { CreateTaskPayload, ITask, UpdateTaskPayload } from '../types';

export const createTask = async (payload: CreateTaskPayload): Promise<ITask> => {
  const { data } = await api.post('/api/tasks', payload);
  return data;
};

export const updateTask = async (
  taskId: string,
  payload: UpdateTaskPayload
): Promise<ITask> => {
  const { data } = await api.put(`/api/tasks/${taskId}`, payload);
  return data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/api/tasks/${taskId}`);
};

export const completePomodoro = async (taskId: string): Promise<ITask> => {
  const { data } = await api.put(`/api/tasks/${taskId}/complete-pomodoro`);
  return data;
};