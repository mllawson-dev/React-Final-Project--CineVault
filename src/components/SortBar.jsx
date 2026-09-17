
const SORTS = [{ key: 'curated', label: 'Collection order' }, { key: 'az', label: 'A → Z' }, { key: 'newest', label: 'Newest first' }, { key: 'oldest', label: 'Oldest first' }, { key: 'rating', label: 'Top rated' }];
export default function SortBar({ sort, onSort, count, total, page, isSearch, disabled }) {
  return <div className="controls-bar">
    <div className="results-count">{disabled ? 'Loading films…' : isSearch ? <>Showing <strong>{count}</strong> of {total} matches · page {page}</> : <>Showing <strong>{count}</strong> films</>}</div>
    <div className="sort-row"><label className="sort-label" htmlFor="film-sort">Sort by</label><select id="film-sort" className="sort-btn" value={sort} onChange={e => onSort(e.target.value)} disabled={disabled}>{SORTS.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></div>
  </div>;
}
