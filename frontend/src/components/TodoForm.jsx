import { useEffect, useState } from 'react';

function TodoForm({ onSubmit, editTodo, onCancelEdit }) {
  const isEditing = Boolean(editTodo);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('GENERAL');
  const [status, setStatus] = useState('OPEN');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title || '');
      setDescription(editTodo.description || '');
      setPriority(editTodo.priority || 'MEDIUM');
      setCategory(editTodo.category || 'GENERAL');
      setStatus(editTodo.status || 'OPEN');
      setDueDate(editTodo.dueDate ? editTodo.dueDate.slice(0, 10) : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setCategory('GENERAL');
      setStatus('OPEN');
      setDueDate('');
    }
  }, [editTodo]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    const payload = { title, description, priority, category, status, dueDate: dueDate || null };
    onSubmit(payload);
    if (!isEditing) {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setCategory('GENERAL');
      setStatus('OPEN');
      setDueDate('');
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit todo' : 'Create todo'}</h2>

      <input aria-label="Todo title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />

      <textarea
        aria-label="Todo description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description"
        style={{ marginTop: '0.75rem' }}
      />

      <div className="row" style={{ marginTop: '0.75rem', gap: '0.5rem' }}>
        <select aria-label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="GENERAL">General</option>
          <option value="WORK">Work</option>
          <option value="PERSONAL">Personal</option>
        </select>

        {isEditing && (
          <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        )}
      </div>

      <input
        type="date"
        aria-label="Due date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ marginTop: '0.75rem' }}
      />

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <button type="submit">{isEditing ? 'Update' : 'Save'}</button>
        {isEditing && (
          <button type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TodoForm;
