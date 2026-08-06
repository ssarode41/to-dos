function SearchBar({ value, onChange }) {
  return (
    <input aria-label="Search todos" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search todos" />
  );
}

export default SearchBar;
