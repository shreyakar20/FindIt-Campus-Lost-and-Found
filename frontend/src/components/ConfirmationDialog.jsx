import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, itemName, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-wrapper">
          <AlertTriangle size={32} className="confirm-icon" />
        </div>

        <h3 className="confirm-title">{title || 'Confirm Deletion'}</h3>

        <p className="confirm-message">
          {message || 'Are you sure you want to permanently delete this listing?'}
        </p>

        {itemName && (
          <div className="confirm-item-preview">
            <span>Item: <strong>{itemName}</strong></span>
          </div>
        )}

        <p className="confirm-warning">This action cannot be undone and will remove the record from MongoDB.</p>

        <div className="confirm-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Item'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
