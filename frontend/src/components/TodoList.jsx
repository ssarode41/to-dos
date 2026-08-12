function TodoList({ todos, onComplete, onDelete, onEdit }) {
  if (!todos.length) {
    return <div className="panel">No todos yet. Add one to get started.</div>;
  }

  return (
    <div className="grid">
      {todos.map((todo) => {
        const id = todo._id || todo.id;
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
              {todo.dueDate && (
                <span className="badge">Due: {new Date(todo.dueDate).toISOString().slice(0, 10)}</span>
              )}
            </div>
            <div className="row" style={{ marginTop: '0.75rem' }}>
              <button onClick={() => onEdit(todo)}>Edit</button>
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
