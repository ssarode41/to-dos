import { useState } from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import { useTodos } from '../hooks/useTodos';

function completedFromFilter(filter) {
  if (filter === 'done') return true;
  if (filter === 'open') return false;
  return undefined;
}

function Dashboard() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const { todos, loading, error, addTodo, editTodo, removeTodo, markComplete } = useTodos({
    q: query,
    completed: completedFromFilter(filter),
  });

  return (
    <div className="grid two">
      <div className="grid">
        <TodoForm onSubmit={addTodo} />
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
              onComplete={markComplete}
              onDelete={removeTodo}
              onEdit={editTodo}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
