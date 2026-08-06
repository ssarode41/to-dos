import { useEffect, useState } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo, completeTodo } from '../api/todoApi';

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await getTodos();
      setTodos(response.data || []);
      setError('');
    } catch (err) {
      setError('Unable to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (payload) => {
    try {
      const response = await createTodo(payload);
      setTodos((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError('Unable to create todo');
      return null;
    }
  };

  const editTodo = async (id, payload) => {
    try {
      const response = await updateTodo(id, payload);
      setTodos((prev) => prev.map((todo) => (todo._id === id ? response.data : todo)));
      return response.data;
    } catch (err) {
      setError('Unable to update todo');
      return null;
    }
  };

  const removeTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
      return true;
    } catch (err) {
      setError('Unable to delete todo');
      return false;
    }
  };

  const markComplete = async (id) => {
    try {
      const response = await completeTodo(id);
      setTodos((prev) => prev.map((todo) => (todo._id === id ? response.data : todo)));
      return response.data;
    } catch (err) {
      setError('Unable to complete todo');
      return null;
    }
  };

  return { todos, loading, error, addTodo, editTodo, removeTodo, markComplete, refresh: fetchTodos };
}
