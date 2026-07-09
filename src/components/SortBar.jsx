const SORTS = [
  { key: 'az',     label: 'A → Z' },
  { key: 'za',     label: 'Z → A' },
  { key: 'newest', label: 'Newest First' },
  { key: 'oldest', label: 'Oldest First' },
  { key: 'rating', label: 'Top Rated' },
];

export default function SortBar({ sort, onSort, count }) {
  return (
    <div className="controls-bar">
      <div className="results-count">
        Showing <strong>{count}</strong> films
      </div>
      <div className="sort-row">
        <span className="sort-label">Sort by:</span>
        {SORTS.map(s => (
          <button
            key={s.key}
            className={`sort-btn${sort === s.key ? ' active' : ''}`}
            onClick={() => onSort(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
