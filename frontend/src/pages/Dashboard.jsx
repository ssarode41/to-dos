import { useMemo, useState } from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import { useTodos } from '../hooks/useTodos';

function Dashboard() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingTodo, setEditingTodo] = useState(null);

  const params = useMemo(() => {
    const p = {};
    if (query) p.q = query;
    if (filter === 'open') p.completed = false;
    if (filter === 'done') p.completed = true;
    return p;
  }, [query, filter]);

  const { todos, loading, error, addTodo, editTodo, removeTodo, markComplete } = useTodos(params);

  const handleCreate = async (payload) => {
    await addTodo(payload);
  };

  const handleEdit = async (payload) => {
    if (!editingTodo) return;
    await editTodo(editingTodo._id || editingTodo.id, payload);
    setEditingTodo(null);
  };

  return (
    <div className="grid two">
      <div className="grid">
        {editingTodo ? (
          <TodoForm
            key={editingTodo._id || editingTodo.id}
            initialValues={editingTodo}
            onSubmit={handleEdit}
            onCancel={() => setEditingTodo(null)}
          />
        ) : (
          <TodoForm key="create" onSubmit={handleCreate} />
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
              todos={todos}
              onEdit={setEditingTodo}
              onComplete={markComplete}
              onDelete={removeTodo}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
