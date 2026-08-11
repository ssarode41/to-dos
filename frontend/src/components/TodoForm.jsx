import { useState } from 'react';

const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];

function TodoForm({ onSubmit, onCancel, initialValues }) {
  const isEditing = Boolean(initialValues);
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [priority, setPriority] = useState(initialValues?.priority || 'MEDIUM');
  const [category, setCategory] = useState(initialValues?.category || 'GENERAL');
  const [dueDate, setDueDate] = useState(initialValues?.dueDate ? initialValues.dueDate.slice(0, 10) : '');
  const [titleError, setTitleError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      setTitleError('Title is required.');
      return;
    }
    setTitleError('');
    onSubmit({ title: title.trim(), description, priority, category, dueDate: dueDate || null });
    if (!isEditing) {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setCategory('GENERAL');
      setDueDate('');
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit todo' : 'Create todo'}</h2>
      <input
        aria-label="Todo title"
        value={title}
        onChange={(e) => { setTitle(e.target.value); if (titleError) setTitleError(''); }}
        placeholder="Task title"
      />
      {titleError && <p style={{ color: 'red', margin: '0.25rem 0 0' }}>{titleError}</p>}
      <textarea
        aria-label="Todo description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description"
        style={{ marginTop: '0.75rem' }}
      />
      <div className="row" style={{ marginTop: '0.75rem', gap: '0.5rem' }}>
        <label htmlFor="todo-priority" style={{ alignSelf: 'center' }}>Priority</label>
        <select
          id="todo-priority"
          aria-label="Todo priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="row" style={{ marginTop: '0.75rem', gap: '0.5rem' }}>
        <label htmlFor="todo-category" style={{ alignSelf: 'center' }}>Category</label>
        <input
          id="todo-category"
          aria-label="Todo category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />
      </div>
      <div className="row" style={{ marginTop: '0.75rem', gap: '0.5rem' }}>
        <label htmlFor="todo-due-date" style={{ alignSelf: 'center' }}>Due date</label>
        <input
          id="todo-due-date"
          aria-label="Todo due date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div className="row" style={{ marginTop: '0.75rem' }}>
        <button type="submit">{isEditing ? 'Save changes' : 'Save'}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

export default TodoForm;
