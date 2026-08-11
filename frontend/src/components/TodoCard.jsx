function formatDueDate(dueDate) {
  if (!dueDate) return '';
  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return String(dueDate);
  return date.toLocaleDateString();
}

function TodoCard({ todo }) {
  return (
    <div className="panel">
      <h3>{todo.title}</h3>
      <p>{todo.description}</p>
      <div className="row">
        <span className="badge">{todo.priority}</span>
        <span className="badge">{todo.category}</span>
      </div>
      {todo.dueDate ? (
        <p style={{ marginTop: '0.75rem' }}>
          Due: <strong>{formatDueDate(todo.dueDate)}</strong>
        </p>
     ) : null}
    </div>
  );
}

export default TodoCard;
