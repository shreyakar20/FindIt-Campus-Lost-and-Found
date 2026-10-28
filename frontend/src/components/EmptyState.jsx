import React from 'react';
import { PackageOpen, RotateCcw, PlusCircle } from 'lucide-react';

const EmptyState = ({ isFiltered, onResetFilters, onOpenReportModal }) => {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon">
        <PackageOpen size={48} />
      </div>

      <h3 className="empty-state-title">
        {isFiltered ? 'No matching items found' : 'No items reported yet'}
      </h3>

      <p className="empty-state-desc">
        {isFiltered
          ? 'Try adjusting your search terms or clearing your status and category filters to see more listings.'
          : 'Be the first to report a lost or found belonging to help your campus community!'}
      </p>

      <div className="empty-state-actions">
        {isFiltered ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onResetFilters}
          >
            <RotateCcw size={16} />
            <span>Reset All Filters</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onOpenReportModal()}
          >
            <PlusCircle size={16} />
            <span>Report First Item</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
