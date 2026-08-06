function TodoList({ todos, onComplete, onDelete }) {
  if (!todos.length) {
    return <div className="panel">No todos yet. Add one to get started.</div>;
  }

  return (
    <div className="grid">
      {todos.map((todo) => (
        <div key={todo._id || todo.id} className="panel">
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
            <button onClick={() => onComplete(todo._id || todo.id)}>Complete</button>
            <button onClick={() => onDelete(todo._id || todo.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodoList;
