import { useState } from 'react';

function TodoForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, description, priority: 'MEDIUM', category: 'GENERAL' });
    setTitle('');
    setDescription('');
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>Create todo</h2>
      <input aria-label="Todo title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" />
      <textarea aria-label="Todo description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Short description" style={{ marginTop: '0.75rem' }} />
      <button type="submit" style={{ marginTop: '0.75rem' }}>Save</button>
    </form>
  );
}

export default TodoForm;
