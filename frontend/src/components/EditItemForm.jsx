import React, { useState, useEffect } from 'react';
import { X, Edit2, AlertCircle, Calendar, MapPin, Tag, UserCheck, FileText, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  'Electronics',
  'Documents/ID Cards',
  'Books',
  'Accessories',
  'Clothing',
  'Other'
];

const STATUSES = ['Lost', 'Found', 'Returned'];

const EditItemForm = ({ isOpen, onClose, onUpdate, item, isSubmitting }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    type: 'Lost',
    category: 'Electronics',
    description: '',
    location: '',
    date: '',
    contact: '',
    status: 'Lost'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item && isOpen) {
      let formattedDate = '';
      if (item.date) {
        try {
          formattedDate = new Date(item.date).toISOString().split('T')[0];
        } catch {
          formattedDate = '';
        }
      }

      setFormData({
        itemName: item.itemName || '',
        type: item.type || 'Lost',
        category: item.category || 'Electronics',
        description: item.description || '',
        location: item.location || '',
        date: formattedDate,
        contact: item.contact || '',
        status: item.status || 'Lost'
      });
      setErrors({});
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Please enter the item name.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please state where the item was lost or found.';
    }

    if (!formData.date) {
      newErrors.date = 'Please pick a valid date.';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Please provide contact information.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the item.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onUpdate(item._id, formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Edit2 size={22} className="modal-icon text-primary" />
            <div>
              <h2 className="modal-title">Edit Listing Details</h2>
              <p className="modal-subtitle">Update item information or change status to Returned</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="item-form" noValidate>
          {/* Status & Type Selection */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Current Status <span className="required-star">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select status-highlight-select"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status === 'Returned' ? '✨ Returned / Reunited to Owner' : status}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type" className="form-label">
                Report Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </div>
          </div>

          {/* Item Name */}
          <div className="form-group">
            <label htmlFor="edit-itemName" className="form-label">
              Item Name <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <FileText size={16} className="field-icon" />
              <input
                type="text"
                id="edit-itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className={`form-input ${errors.itemName ? 'input-error' : ''}`}
              />
            </div>
            {errors.itemName && <span className="error-text"><AlertCircle size={13} /> {errors.itemName}</span>}
          </div>

          {/* Category & Date */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-category" className="form-label">
                Category <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <Tag size={16} className="field-icon" />
                <select
                  id="edit-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-date" className="form-label">
                Date <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <Calendar size={16} className="field-icon" />
                <input
                  type="date"
                  id="edit-date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`form-input ${errors.date ? 'input-error' : ''}`}
                />
              </div>
              {errors.date && <span className="error-text"><AlertCircle size={13} /> {errors.date}</span>}
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="edit-location" className="form-label">
              Location <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <MapPin size={16} className="field-icon" />
              <input
                type="text"
                id="edit-location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`form-input ${errors.location ? 'input-error' : ''}`}
              />
            </div>
            {errors.location && <span className="error-text"><AlertCircle size={13} /> {errors.location}</span>}
          </div>

          {/* Contact */}
          <div className="form-group">
            <label htmlFor="edit-contact" className="form-label">
              Contact Information <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <UserCheck size={16} className="field-icon" />
              <input
                type="text"
                id="edit-contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className={`form-input ${errors.contact ? 'input-error' : ''}`}
              />
            </div>
            {errors.contact && <span className="error-text"><AlertCircle size={13} /> {errors.contact}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="edit-description" className="form-label">
              Description <span className="required-star">*</span>
            </label>
            <textarea
              id="edit-description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
            />
            {errors.description && <span className="error-text"><AlertCircle size={13} /> {errors.description}</span>}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemForm;
