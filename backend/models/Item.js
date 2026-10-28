const mongoose = require('mongoose');

const VALID_CATEGORIES = [
  'Electronics',
  'Documents/ID Cards',
  'Books',
  'Accessories',
  'Clothing',
  'Other'
];

const itemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [120, 'Item name cannot exceed 120 characters']
    },
    type: {
      type: String,
      required: [true, 'Item type (Lost or Found) is required'],
      enum: {
        values: ['Lost', 'Found'],
        message: '{VALUE} is not a valid item type. Must be "Lost" or "Found".'
      }
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: VALID_CATEGORIES,
        message: '{VALUE} is not a valid category.'
      }
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters']
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    contact: {
      type: String,
      required: [true, 'Contact information is required'],
      trim: true,
      maxlength: [150, 'Contact info cannot exceed 150 characters']
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Lost', 'Found', 'Returned'],
        message: '{VALUE} is not a valid status. Must be "Lost", "Found", or "Returned".'
      },
      default: function () {
        return this.type === 'Found' ? 'Found' : 'Lost';
      }
    }
  },
  {
    timestamps: true // Automatically manages createdAt and updatedAt
  }
);

// Helpful index for search performance
itemSchema.index({ itemName: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Item', itemSchema);
