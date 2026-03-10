/**
 * SearchBar.jsx
 * Search and filter controls for the students table.
 *
 * Props:
 *  - searchQuery: string
 *  - onSearchChange: (value: string) => void
 *  - ageMin: string
 *  - ageMax: string
 *  - onAgeMinChange: (value: string) => void
 *  - onAgeMaxChange: (value: string) => void
 *  - onClear: () => void
 *  - resultCount: number
 */

const SearchBar = ({
  searchQuery,
  onSearchChange,
  ageMin,
  ageMax,
  onAgeMinChange,
  onAgeMaxChange,
  onClear,
  resultCount,
}) => {
  const hasFilters = searchQuery || ageMin || ageMax;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Search input */}
      <div className="relative flex-1 min-w-0">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email…"
          className="input pl-9 pr-4"
          aria-label="Search students"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-2 flex items-center px-1 text-slate-500 hover:text-slate-300"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Age range */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 whitespace-nowrap">Age:</span>
        <input
          type="number"
          value={ageMin}
          onChange={(e) => onAgeMinChange(e.target.value)}
          placeholder="Min"
          min="1"
          max="120"
          className="input w-20 text-center"
          aria-label="Minimum age"
        />
        <span className="text-slate-600">–</span>
        <input
          type="number"
          value={ageMax}
          onChange={(e) => onAgeMaxChange(e.target.value)}
          placeholder="Max"
          min="1"
          max="120"
          className="input w-20 text-center"
          aria-label="Maximum age"
        />
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button onClick={onClear} className="btn-secondary btn-sm whitespace-nowrap" title="Clear all filters">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Clear
        </button>
      )}

      {/* Result count badge */}
      {hasFilters && (
        <span className="badge bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 whitespace-nowrap">
          {resultCount} found
        </span>
      )}
    </div>
  );
};

export default SearchBar;
