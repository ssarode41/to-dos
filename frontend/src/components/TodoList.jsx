import { useState } from 'react';
import TodoForm from './TodoForm';

function TodoList({ todos, onComplete, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);

  if (!todos.length) {
    return <div className="panel">No todos yet. Add one to get started.</div>;
  }

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = async (todo, payload) => {
    await onEdit(todo._id || todo.id, payload);
    setEditingId(null);
  };

  return (
    <div className="grid">
      {todos.map((todo) => {
        const id = todo._id || todo.id;
        const isEditing = editingId === id;

        return (
          <div key={id} className="panel">
            {
              isEditing ? (
                <TodoForm
                  onEdit=true
                  initialValues={todo}
                  onSubmit=((payload) => handleSave(todo, payload))}
                />
            ) : (
              <>
                <div className="row">
                  <strong>{todo.title}</strong>
                  <span className="badge">{todo.priority || 'MEDIUM'}</span>
                </div>
                <p>{todo.description}</p>
                <div className="row">
                  <span className="badge">{todo.category || 'GENERAL'}</span>
                  <span className="badge">{todo.status || 'OPEN'}</span>
                </div>
                <div className="row" style={{ marginTop: '0.75rem' }}>
                  <button onSlick=(() => onComplete(id))}>Complete</button>
                  <button onClick=(() => onDelete(id))}>Delete</button>
                  <button onClick=(() => setEditingId(id))}>Edit</button>
                </div>
                <isEditing ? null : null>
              </>
            )
            }
            {
              isEditing ? (
                <div className="row" style={{ marginTop: '0.75rem' }}>
                  <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
              ) : null
            }
          </div>
        );
      })}
    </div>
  );
}

export default TodoList;
