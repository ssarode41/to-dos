import { useMemo, useState } from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import { useTodos } from '../hooks/useTodos';

function Dashboard() {
  const { todos, loading, error, addTodo, removeTodo, markComplete, editTodo } = useTodos();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingTodo, setEditingTodo] = useState(null);

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesQuery = todo.title.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === 'all' || (filter === 'open' && !todo.completed) || (filter === 'done' && todo.completed);
      return matchesQuery && matchesFilter;
    });
  }, [filter, query, todos]);

  const handleEdit = async (payload) => {
    await editTodo(editingTodo._id || editingTodo.id, payload);
    setEditingTodo(null);
  };

  return (
    <div className="grid two">
      <div className="grid">
        {editingTodo ? (
          <TodoForm
            initialValues={editingTodo}
            onSubmit={handleEdit}
            onCancel={() => setEditingTodo(null)}
          />
        ) : (
          <TodoForm onSubmit={addTodo} />
        )}
        <div className="panel">
          <div className="row">
            <SearchBar value={query} onChange={setQuery} />
            <FilterBar value={filter} onChange={setFilter} />
          </div>
        </div>
      </div>
      <div className="grid">
        <div className="panel">
          <h2>Todo dashboard</h2>
          {error && <p>{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <TodoList
              todos={visibleTodos}
              onComplete={markComplete}
              onDelete={removeTodo}
              onEdit={setEditingTodo}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
