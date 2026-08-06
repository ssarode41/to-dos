function TodoCard({ todo }) {
  return (
    <div className="panel">
      <h3>{todo.title}</h3>
      <p>{todo.description}</p>
      <div className="row">
        <span className="badge">{todo.priority}</span>
        <span className="badge">{todo.category}</span>
      </div>
    </div>
  );
}

export default TodoCard;
