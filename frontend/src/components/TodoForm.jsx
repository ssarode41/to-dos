import { useState, useEffect } from 'react';

function TodoForm({ onSubmit, initialValues, onCancel }) {
  const isEdit = Boolean(initialValues);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('GENERAL');
  const [status, setStatus] = useState('OPEN');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setDescription(initialValues.description || '');
      setPriority(initialValues.priority || 'MEDIUM');
      setCategory(initialValues.category || 'GENERAL');
      setStatus(initialValues.status || 'OPEN');
      setDueDate(initialValues.dueDate ? initialValues.dueDate.slice(0, 10) : '');
    }
  }, [initialValues]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    const payload = { title, description, priority, category, dueDate: dueDate || null };
    if (isEdit) payload.status = status;
    onSubmit(payload);
    if (!isEdit) {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setCategory('GENERAL');
      setDueDate('');
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Edit todo' : 'Create todo'}</h2>
      <input
        aria-label="Todo title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
      />
      <textarea
        aria-label="Todo description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description"
        style={{ marginTop: '0.75rem' }}
      />
      <select
        aria-label="Todo priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        style={{ marginTop: '0.75rem' }}
      >
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>
      <input
        aria-label="Todo category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        style={{ marginTop: '0.75rem' }}
      />
      {isEdit && (
        <select
          aria-label="Todo status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ marginTop: '0.75rem' }}
        >
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      )}
      <input
        aria-label="Todo due date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ marginTop: '0.75rem' }}
      />
      <div className="row" style={{ marginTop: '0.75rem' }}>
        <button type="submit">{isEdit ? 'Update' : 'Save'}</button>
        {isEdit && (
          <button type="button" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}

export default TodoForm;
