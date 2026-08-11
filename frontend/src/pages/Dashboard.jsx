import { useCallback, useRef, useState } from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import { useTodos } from '../hooks/useTodos';

const DEFAULT_FILTERS = { status: '', priority: '', category: '', sortBy: 'createdDate', sortOrder: 'desc' };

function Dashboard() {
  const { todos, pagination, loading, error, addTodo, editTodo, removeTodo, markComplete, markReopen, refresh } = useTodos();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [editingTodo, setEditingTodo] = useState(null);
  const [page, setPage] = useState(1);
  const debounceRef = useRef(null);

  const buildParams = useCallback(
    (overrides = {}) => {
      const p = { ...filters, ...overrides };
      const params = { page, limit: 20 };
      if (query) params.q = query;
      if (p.status) params.status = p.status;
      if (p.priority) params.priority = p.priority;
      if (p.category) params.category = p.category;
      if (p.sortBy) params.sortBy = p.sortBy;
      if (p.sortOrder) params.sortOrder = p.sortOrder;
      return params;
    },
    [filters, page, query]
  );

  const applyFilters = useCallback(
    (newFilters, newPage = 1) => {
      setFilters(newFilters);
      setPage(newPage);
      refresh({ ...buildParams({ ...newFilters }), page: newPage });
    },
    [buildParams, refresh]
  );

  const handleQueryChange = (value) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      refresh({ ...buildParams(), q: value || undefined, page: 1 });
    }, 400);
  };

  const handleFiltersChange = (newFilters) => applyFilters(newFilters);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    refresh({ ...buildParams(), page: newPage });
  };

  const handleAddTodo = async (payload) => {
    await addTodo(payload);
    refresh(buildParams());
  };

  const handleEditSubmit = async (payload) => {
    if (!editingTodo) return;
    await editTodo(editingTodo._id, payload);
    setEditingTodo(null);
  };

  return (
    <div className="grid two">
      <div className="grid">
        <TodoForm
          onSubmit={editingTodo ? handleEditSubmit : handleAddTodo}
          editTodo={editingTodo}
          onCancelEdit={() => setEditingTodo(null)}
        />
        <div className="panel">
          <SearchBar value={query} onChange={handleQueryChange} />
          <FilterBar filters={filters} onChange={handleFiltersChange} />
        </div>
      </div>

      <div className="grid">
        <div className="panel">
          <h2>Todo dashboard</h2>
          {error && <p>{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <TodoList
                todos={todos}
                onComplete={markComplete}
                onReopen={markReopen}
                onEdit={setEditingTodo}
                onDelete={removeTodo}
              />
              {pagination && pagination.pages > 1 && (
                <div className="row" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                  <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
                    Prev
                  </button>
                  <span>
                    {page} / {pagination.pages}
                  </span>
                  <button disabled={page >= pagination.pages} onClick={() => handlePageChange(page + 1)}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
