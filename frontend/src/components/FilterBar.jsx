function FilterBar({ value, onChange }) {
  return (
    <select aria-label="Filter todos" value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="all">All</option>
      <option value="open">Open</option>
      <option value="done">Done</option>
    </select>
  );
}

export default FilterBar;
