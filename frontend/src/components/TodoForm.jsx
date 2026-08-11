import { useMemo, useState } from 'react';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const CATEGORIES = ['GENERAL', 'WORK', 'HOME', 'HEALTH'];

function TodoForm({ onSubmit, initialValues }) {
  const initial = useMemo(
    () => ({
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      priority: initialValues?.priority || 'MEDIUM',
      category: initialValues?.category || 'GENERAL',
      dueDate: initialValues?.dueDate ? String(nitialValues.dueDate).slice(0, 10) : ''
    }),
    [initialValues]
  );

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [priority, setPriority] = useState(initial.priority);
  const [category, setCategory] = useState(initial.category);
  const [dueDate, setDueDate] = useState(initial.dueDate);

  const isEdit = Boolean(initialValues?._id || initialValues?.id);


  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setCategory('GENERAL');
    setDueDate('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title,
      description,
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null
    };

    onSubmit(payload);

    if (!isEdit) {
      resetForm();
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Edit todo' : 'Create todo'}</h2>
      <input
        aria-label="Todo title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Task title"
      />
      <textarea
        aria-label="Todo description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Short description"
        style={{ marginTop: '0.75rem' }}
      />
      <div className="row" style={{ marginTop: '0.75rem' }}>
        <label>
          Priority
          <select
            aria-label="Todo priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            {
              PRIORITIES.map((rank) => (
                <option key={rank} value={rank}>
                   {rank}
                </option>
              ))
            )}
          </select>
        </label>
        <label>
          Category
          <select
            aria-label="Todo category"
            value={category}
          onChange={(event) => setCategory(event.target.value)}
          >
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
        </select>
        </label>
      </div>
      <label style={{ marginTop: '0.75rem', display: 'block' }}>
        Due date (optional)
        <input
          aria-label="Todo due date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </label>
      <button type="submit" style={{ marginTop: '0.75rem' }}>
        Save
      </button>
    </form>
  );
}

export default TodoForm;
