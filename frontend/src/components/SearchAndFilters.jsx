import React from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electronics',
  'Documents/ID Cards',
  'Books',
  'Accessories',
  'Clothing',
  'Other'
];

const STATUSES = ['All', 'Lost', 'Found', 'Returned'];

const SearchAndFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  onResetFilters,
  totalResults,
  totalItems
}) => {
  const isFiltered =
    searchQuery.trim() !== '' ||
    statusFilter !== 'All' ||
    categoryFilter !== 'All';

  return (
    <div className="search-filters-card" id="listings-section">
      <div className="search-filters-top">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search items by name, description, location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="filter-group">
          <label htmlFor="status-filter" className="filter-label">
            Status:
          </label>
          <select
            id="status-filter"
            className="filter-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status === 'All' ? 'All Statuses' : status}
              </option>
            ))}
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="filter-group">
          <label htmlFor="category-filter" className="filter-label">
            Category:
          </label>
          <select
            id="category-filter"
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Reset button if filter is active */}
        {isFiltered && (
          <button
            type="button"
            className="btn btn-ghost reset-btn"
            onClick={onResetFilters}
            title="Reset all search & filters"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Meta feedback line */}
      <div className="search-meta">
        <span className="results-count">
          Showing <strong>{totalResults}</strong> of {totalItems} items
        </span>
        {isFiltered && (
          <span className="active-filters-tag">
            Filters active
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilters;
