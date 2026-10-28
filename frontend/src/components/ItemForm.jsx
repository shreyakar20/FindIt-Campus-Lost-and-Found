import React, { useState, useEffect } from 'react';
import { X, PlusCircle, AlertCircle, Calendar, MapPin, Tag, UserCheck, FileText } from 'lucide-react';

const CATEGORIES = [
  'Electronics',
  'Documents/ID Cards',
  'Books',
  'Accessories',
  'Clothing',
  'Other'
];

const ItemForm = ({ isOpen, onClose, onSubmit, initialType = 'Lost', isSubmitting }) => {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    itemName: '',
    type: initialType,
    category: 'Electronics',
    description: '',
    location: '',
    date: getTodayString(),
    contact: '',
    status: initialType === 'Found' ? 'Found' : 'Lost'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        itemName: '',
        type: initialType,
        category: 'Electronics',
        description: '',
        location: '',
        date: getTodayString(),
        contact: '',
        status: initialType === 'Found' ? 'Found' : 'Lost'
      });
      setErrors({});
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      status: newType === 'Found' ? 'Found' : 'Lost'
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error for field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Please enter the item name.';
    } else if (formData.itemName.trim().length < 2) {
      newErrors.itemName = 'Item name must be at least 2 characters.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please state where the item was lost or found.';
    }

    if (!formData.date) {
      newErrors.date = 'Please pick a valid date.';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Please provide contact information (email or phone).';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the item (color, model, distinguishing marks).';
    } else if (formData.description.trim().length < 5) {
      newErrors.description = 'Description must be at least 5 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <PlusCircle size={22} className="modal-icon text-primary" />
            <div>
              <h2 className="modal-title">Report an Item</h2>
              <p className="modal-subtitle">Log a lost or found belonging to help reunite it on campus</p>
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
          {/* Type Selector Toggle */}
          <div className="form-group">
            <label className="form-label">Report Type</label>
            <div className="type-toggle-group">
              <button
                type="button"
                className={`type-toggle-btn ${formData.type === 'Lost' ? 'active lost' : ''}`}
                onClick={() => handleTypeChange('Lost')}
              >
                🔴 I Lost An Item
              </button>
              <button
                type="button"
                className={`type-toggle-btn ${formData.type === 'Found' ? 'active found' : ''}`}
                onClick={() => handleTypeChange('Found')}
              >
                🟢 I Found An Item
              </button>
            </div>
          </div>

          {/* Item Name */}
          <div className="form-group">
            <label htmlFor="itemName" className="form-label">
              Item Name <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <FileText size={16} className="field-icon" />
              <input
                type="text"
                id="itemName"
                name="itemName"
                placeholder="e.g. Apple AirPods Pro with Black Case"
                value={formData.itemName}
                onChange={handleChange}
                className={`form-input ${errors.itemName ? 'input-error' : ''}`}
              />
            </div>
            {errors.itemName && <span className="error-text"><AlertCircle size={13} /> {errors.itemName}</span>}
          </div>

          {/* Category & Date Grid */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <Tag size={16} className="field-icon" />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`form-select ${errors.category ? 'input-error' : ''}`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && <span className="error-text"><AlertCircle size={13} /> {errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date {formData.type === 'Lost' ? 'Lost' : 'Found'} <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <Calendar size={16} className="field-icon" />
                <input
                  type="date"
                  id="date"
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
            <label htmlFor="location" className="form-label">
              Campus Location <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <MapPin size={16} className="field-icon" />
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g. Central Library, 2nd Floor Study Room 204"
                value={formData.location}
                onChange={handleChange}
                className={`form-input ${errors.location ? 'input-error' : ''}`}
              />
            </div>
            {errors.location && <span className="error-text"><AlertCircle size={13} /> {errors.location}</span>}
          </div>

          {/* Contact Info */}
          <div className="form-group">
            <label htmlFor="contact" className="form-label">
              Contact Information <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <UserCheck size={16} className="field-icon" />
              <input
                type="text"
                id="contact"
                name="contact"
                placeholder="e.g. alex.chen@campus.edu or (555) 345-6789"
                value={formData.contact}
                onChange={handleChange}
                className={`form-input ${errors.contact ? 'input-error' : ''}`}
              />
            </div>
            {errors.contact && <span className="error-text"><AlertCircle size={13} /> {errors.contact}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="required-star">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Provide identifiable details, colors, marks, stickers, or brand names..."
              value={formData.description}
              onChange={handleChange}
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
            />
            {errors.description && <span className="error-text"><AlertCircle size={13} /> {errors.description}</span>}
          </div>

          {/* Modal Footer Actions */}
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
              {isSubmitting ? 'Submitting to MongoDB...' : `Submit ${formData.type} Report`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
