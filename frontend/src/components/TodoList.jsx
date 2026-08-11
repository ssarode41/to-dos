function TodoList({ todos, onComplete, onReopen, onEdit, onDelete }) {
  if (!todos.length) {
    return <div className="panel">No todos yet. Add one to get started.</div>;
  }

  return (
    <div className="grid">
      {todos.map((todo) => {
        const id = todo._id || todo.id;
        const isDone = todo.completed || todo.status === 'DONE';
        return (
          <div key={id} className="panel">
            <div className="row">
              <strong>{todo.title}</strong>
              <span className="badge">{todo.priority || 'MEDIUM'}</span>
            </div>
            {todo.description && <p>{todo.description}</p>}
            <div className="row">
              <span className="badge">{todo.category || 'GENERAL'}</span>
              <span className="badge">{todo.status || 'OPEN'}</span>
              {todo.dueDate && <span className="badge">Due: {todo.dueDate.slice(0, 10)}</span>}
            </div>
            <div className="row" style={{ marginTop: '0.75rem' }}>
              <button onClick={() => onEdit(todo)}>Edit</button>
              {isDone ? (
                <button onClick={() => onReopen(id)}>Reopen</button>
              ) : (
                <button onClick={() => onComplete(id)}>Complete</button>
              )}
              <button onClick={() => onDelete(id)}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TodoList;
