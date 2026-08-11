import { useCallback, useEffect, useState } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo, completeTodo, reopenTodo } from '../api/todoApi';

export function useTodos(initialParams = {}) {
  const [todos, setTodos] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTodos = useCallback(
    async (params = initialParams) => {
      setLoading(true);
      try {
        const response = await getTodos(params);
        const body = response.data;
        if (body && body.data !== undefined) {
          setTodos(body.data);
          setPagination(body.pagination || null);
        } else {
          setTodos(body || []);
          setPagination(null);
        }
        setError('');
      } catch (err) {
        setError('Unable to load todos');
      } finally {
        setLoading(false);
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    fetchTodos(initialParams);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const markReopen = async (id) => {
    try {
      const response = await reopenTodo(id);
      setTodos((prev) => prev.map((todo) => (todo._id === id ? response.data : todo)));
      return response.data;
    } catch (err) {
      setError('Unable to reopen todo');
      return null;
    }
  };

  return { todos, pagination, loading, error, addTodo, editTodo, removeTodo, markComplete, markReopen, refresh: fetchTodos };
}
