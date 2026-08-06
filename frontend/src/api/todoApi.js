import apiClient from './apiClient';

export const getTodos = () => apiClient.get('/todos');
export const createTodo = (payload) => apiClient.post('/todos', payload);
export const updateTodo = (id, payload) => apiClient.put(`/todos/${id}`, payload);
export const completeTodo = (id) => apiClient.patch(`/todos/${id}/complete`);
export const deleteTodo = (id) => apiClient.delete(`/todos/${id}`);
