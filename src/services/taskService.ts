import api from './api';
import type { PaginatedTasks, Task } from '../types/task';

export const fetchTasks = async (url = '/tarefas/'): Promise<PaginatedTasks> => {
  const response = await api.get<PaginatedTasks>(url);
  return response.data;
};

export const createTask = async (task: Omit<Task, 'id' | 'create'>): Promise<Task> => {
  const response = await api.post<Task>('/tarefas/', task);
  return response.data;
};

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  const response = await api.patch<Task>(`/tarefas/${id}/`, task);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tarefas/${id}/`);
};