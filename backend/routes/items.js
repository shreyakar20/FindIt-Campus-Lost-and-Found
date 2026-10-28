const express = require('express');
const mongoose = require('mongoose');
const Item = require('../models/Item');

const router = express.Router();

/**
 * Middleware: Verify database connection before performing database queries
 */
router.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is not connected. Please configure your MongoDB Atlas connection string (MONGO_URI) in backend/.env.',
      database: 'disconnected'
    });
  }
  next();
});

/**
 * Helper: Validate MongoDB ObjectId
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @route   GET /api/items
 * @desc    Get all items with optional search and filters
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { search, status, category, type } = req.query;

    const query = {};

    // Filter by status (Lost, Found, Returned)
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by type (Lost or Found)
    if (type && type !== 'All') {
      query.type = type;
    }

    // Search by item name, description, or location (case-insensitive)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { itemName: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ];
    }

    // Retrieve items sorted by newest first
    const items = await Item.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching items:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch items from database.',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/items/:id
 * @desc    Get a single item by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID format.'
      });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error retrieving item:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve item.',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/items
 * @desc    Create a new lost/found item report
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const {
      itemName,
      type,
      category,
      description,
      location,
      date,
      contact,
      status
    } = req.body;

    // Validate required fields
    if (!itemName || !type || !category || !description || !location || !date || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: itemName, type, category, description, location, date, contact.'
      });
    }

    // Validate type enum
    if (!['Lost', 'Found'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "Lost" or "Found".'
      });
    }

    // Determine initial status (default to type if not provided)
    const initialStatus = status || (type === 'Found' ? 'Found' : 'Lost');

    const newItem = new Item({
      itemName: itemName.trim(),
      type,
      category: category.trim(),
      description: description.trim(),
      location: location.trim(),
      date: new Date(date),
      contact: contact.trim(),
      status: initialStatus
    });

    const savedItem = await newItem.save();

    return res.status(201).json({
      success: true,
      message: 'Item reported successfully.',
      data: savedItem
    });
  } catch (error) {
    console.error('Error creating item:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + messages.join(', '),
        errors: messages
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while creating item.',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/items/:id
 * @desc    Update an existing item details or status
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID format.'
      });
    }

    const {
      itemName,
      type,
      category,
      description,
      location,
      date,
      contact,
      status
    } = req.body;

    // Build update object only with provided fields
    const updateData = {};
    if (itemName !== undefined) updateData.itemName = itemName.trim();
    if (type !== undefined) updateData.type = type;
    if (category !== undefined) updateData.category = category.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (location !== undefined) updateData.location = location.trim();
    if (date !== undefined) updateData.date = new Date(date);
    if (contact !== undefined) updateData.contact = contact.trim();
    if (status !== undefined) updateData.status = status;

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Item updated successfully.',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating item:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + messages.join(', '),
        errors: messages
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while updating item.',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/items/:id
 * @desc    Delete an item by ID
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID format.'
      });
    }

    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Item deleted successfully.',
      data: deletedItem
    });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting item.',
      error: error.message
    });
  }
});

module.exports = router;
