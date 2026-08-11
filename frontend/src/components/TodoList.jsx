import { useState } from 'react';
import TodoForm from './TodoForm';

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function TodoList({ todos, onComplete, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editError, setEditError] = useState('');

  if (!todos.length) {
    return <div className="panel">No todos yet. Add one to get started.</div>;
  }

  const handleEditSubmit = async (id, payload) => {
    setEditError('');
    const result = await onEdit(id, payload);
    if (result) {
      setEditingId(null);
    } else {
      setEditError('Failed to update todo. It may have been deleted.');
    }
  };

  return (
    <div className="grid">
      {todos.map((todo) => {
        const id = todo._id || todo.id;
        const formattedDue = formatDate(todo.dueDate);

        if (editingId === id) {
          return (
            <div key={id}>
              {editError && <p style={{ color: 'red' }}>{editError}</p>}
              <TodoForm
                initialValues={todo}
                onSubmit={(payload) => handleEditSubmit(id, payload)}
                onCancel={() => { setEditingId(null); setEditError(''); }}
              />
            </div>
          );
        }

        return (
          <div key={id} className="panel">
            <div className="row">
              <strong>{todo.title}</strong>
              <span className="badge">{todo.priority || 'MEDIUM'}</span>
            </div>
            <p>{todo.description}</p>
            <div className="row">
              <span className="badge">{todo.category || 'GENERAL'}</span>
              <span className="badge">{todo.status || 'OPEN'}</span>
              {formattedDue && <span className="badge">Due: {formattedDue}</span>}
            </div>
            <div className="row" style={{ marginTop: '0.75rem' }}>
              <button onClick={() => { setEditingId(id); setEditError(''); }}>Edit</button>
              <button onClick={() => onComplete(id)}>Complete</button>
              <button onClick={() => onDelete(id)}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TodoList;
