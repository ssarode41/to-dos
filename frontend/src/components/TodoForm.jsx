import { useState } from 'react';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const CATEGORIES = ['GENERAL', 'WORK', 'PERSONAL'];

function TodoForm({ onSubmit, onCancel, initialValues }) {
  const isEdit = Boolean(initialValues);

  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [priority, setPriority] = useState(initialValues?.priority || 'MEDIUM');
  const [category, setCategory] = useState(initialValues?.category || 'GENERAL');
  const [dueDate, setDueDate] = useState(
    initialValues?.dueDate ? new Date(initialValues.dueDate).toISOString().slice(0, 10) : ''
  );
  const [titleError, setTitleError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    setTitleError('');
    onSubmit({ title, description, priority, category, dueDate: dueDate || null });
    if (!isEdit) {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setCategory('GENERAL');
      setDueDate('');
    }
  };

  return (
    <form aria-label="Todo form" className="panel" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Edit todo' : 'Create todo'}</h2>
      <input
        aria-label="Todo title"
        value={title}
        onChange={(e) => { setTitle(e.target.value); setTitleError(''); }}
        placeholder="Task title"
      />
      {titleError && <p role="alert" style={{ color: 'red', margin: '0.25rem 0 0' }}>{titleError}</p>}
      <textarea
        aria-label="Todo description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description"
        style={{ marginTop: '0.75rem' }}
      />
      <select
        aria-label="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        style={{ marginTop: '0.75rem' }}
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <select
        aria-label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ marginTop: '0.75rem' }}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <input
        aria-label="Due date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ marginTop: '0.75rem' }}
      />
      <div className="row" style={{ marginTop: '0.75rem' }}>
        <button type="submit">{isEdit ? 'Update' : 'Save'}</button>
        {isEdit && onCancel && (
          <button type="button" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}

export default TodoForm;
