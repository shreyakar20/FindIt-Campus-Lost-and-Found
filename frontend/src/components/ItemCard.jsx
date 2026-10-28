import React from 'react';
import {
  MapPin,
  Calendar,
  UserCheck,
  Tag,
  Edit2,
  Trash2,
  CheckCheck,
  CheckCircle2
} from 'lucide-react';

const ItemCard = ({ item, onEdit, onDelete, onQuickMarkReturned }) => {
  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Lost':
        return (
          <span className="badge badge-lost">
            <span className="badge-dot" />
            Lost
          </span>
        );
      case 'Found':
        return (
          <span className="badge badge-found">
            <span className="badge-dot" />
            Found
          </span>
        );
      case 'Returned':
        return (
          <span className="badge badge-returned">
            <CheckCheck size={14} className="badge-icon" />
            Returned / Reunited
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const getTypeBadge = (type) => {
    return (
      <span className={`type-tag ${type === 'Lost' ? 'type-lost' : 'type-found'}`}>
        {type === 'Lost' ? 'Reported Lost' : 'Reported Found'}
      </span>
    );
  };

  return (
    <article className={`item-card ${item.status === 'Returned' ? 'item-returned' : ''}`}>
      {/* Card Header */}
      <div className="card-top-bar">
        {getTypeBadge(item.type)}
        {getStatusBadge(item.status)}
      </div>

      <div className="card-main-info">
        <h3 className="item-title" title={item.itemName}>
          {item.itemName}
        </h3>

        <div className="item-category-pill">
          <Tag size={13} />
          <span>{item.category}</span>
        </div>
      </div>

      {/* Description */}
      <p className="item-description">{item.description}</p>

      {/* Metadata list */}
      <div className="item-meta-list">
        <div className="meta-row">
          <MapPin size={15} className="meta-icon" />
          <span className="meta-label">Location:</span>
          <span className="meta-value">{item.location}</span>
        </div>

        <div className="meta-row">
          <Calendar size={15} className="meta-icon" />
          <span className="meta-label">Date:</span>
          <span className="meta-value">{formatDate(item.date)}</span>
        </div>

        <div className="meta-row contact-row">
          <UserCheck size={15} className="meta-icon" />
          <span className="meta-label">Contact:</span>
          <span className="meta-value contact-text">{item.contact}</span>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="card-actions">
        {item.status !== 'Returned' && (
          <button
            type="button"
            className="btn btn-sm btn-mark-returned"
            onClick={() => onQuickMarkReturned(item)}
            title="Mark this item as Returned to owner"
          >
            <CheckCircle2 size={15} />
            <span>Mark Returned</span>
          </button>
        )}

        <div className="action-buttons-right">
          <button
            type="button"
            className="icon-action-btn edit-btn"
            onClick={() => onEdit(item)}
            title="Edit item details"
            aria-label={`Edit ${item.itemName}`}
          >
            <Edit2 size={16} />
          </button>

          <button
            type="button"
            className="icon-action-btn delete-btn"
            onClick={() => onDelete(item)}
            title="Delete this listing"
            aria-label={`Delete ${item.itemName}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ItemCard;
