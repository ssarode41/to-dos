function FilterBar({ filters, onChange }) {
  const { status = '', priority = '', category = '', sortBy = 'createdDate', sortOrder = 'desc' } = filters || {};

  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="row" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
      <select aria-label="Filter by status" value={status} onChange={(e) => set('status', e.target.value)}>
        <option value="">All statuses</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>

      <select aria-label="Filter by priority" value={priority} onChange={(e) => set('priority', e.target.value)}>
        <option value="">All priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>

      <select aria-label="Filter by category" value={category} onChange={(e) => set('category', e.target.value)}>
        <option value="">All categories</option>
        <option value="GENERAL">General</option>
        <option value="WORK">Work</option>
        <option value="PERSONAL">Personal</option>
      </select>

      <select aria-label="Sort by" value={sortBy} onChange={(e) => set('sortBy', e.target.value)}>
        <option value="createdDate">Created date</option>
        <option value="updatedDate">Updated date</option>
        <option value="dueDate">Due date</option>
        <option value="title">Title</option>
        <option value="priority">Priority</option>
      </select>

      <select aria-label="Sort order" value={sortOrder} onChange={(e) => set('sortOrder', e.target.value)}>
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  );
}

export default FilterBar;
