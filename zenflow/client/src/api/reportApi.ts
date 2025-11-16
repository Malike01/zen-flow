import type { ITask } from '../types';
import api from './axiosConfig';

export interface IWeeklyReport {
  totalTasksCompleted: number;
  totalPomodoros: number;
  tasks: ITask[]; 
}

export const fetchWeeklyReport = async (): Promise<IWeeklyReport> => {
  const { data } = await api.get('/api/reports/weekly');
  return data;
};