import { useCallback, useEffect, useState } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo, completeTodo } from '../api/todoApi';

function getTodoId(todo) {
  return todo?._id || todo?.id;
}

export function useTodos(query = {}) {
  const { q, completed, sort } = query;
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (typeof q === 'string' && q.trim()) params.q = q.trim();
      if (typeof completed === 'boolean') params.completed = completed;
      if (typeof sort === 'string' && sort.trim()) params.sort = sort.trim();

      const response = await getTodos(params);
      setTodos(response.data || []);
      setError('');
    } catch (err) {
      setError('Unable to load todos');
    } finally {
      setLoading(false);
    }
  }, [q, completed, sort]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

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
      const updated = response.data;
      const updatedId = getTodoId(updated) || id;

      setTodos((prev) =>
        prev.map((todo) => (getTodoId(todo) === updatedId ? updated : todo))
      );
      return updated;
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setError('Todo not found – it may have been deleted.');
      } else {
        setError('Unable to update todo');
      }
      return null;
    }
  };

  const removeTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => getTodoId(todo) !== id));
      return true;
    } catch (err) {
      setError('Unable to delete todo');
      return false;
    }
  };

  const markComplete = async (id) => {
    try {
      const response = await completeTodo(id);
      const updated = response.data;
      const updatedId = getTodoId(updated) || id;

      setTodos((prev) =>
        prev.map((todo) => (getTodoId(todo) === updatedId ? updated : todo))
      );
      return updated;
    } catch (err) {
      setError('Unable to complete todo');
      return null;
    }
  };

  return { todos, loading, error, addTodo, editTodo, removeTodo, markComplete, refresh: fetchTodos };
}
