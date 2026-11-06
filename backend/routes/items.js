const express = require('express');
const mongoose = require('mongoose');
const Item = require('../models/Item');

const router = express.Router();

/**
 * In-memory fallback store populated with sample campus items
 * Ensures the API remains 100% operational in demo mode or serverless environments
 * when MongoDB Atlas connection string is not yet configured or is connecting.
 */
let inMemoryItems = [
  {
    _id: 'mock_1',
    itemName: 'Apple AirPods Pro (2nd Gen)',
    type: 'Lost',
    category: 'Electronics',
    description: 'White AirPods Pro in a matte black silicon case with a silver carabiner. Lost around table 14.',
    location: 'Central Library, 2nd Floor Quiet Zone',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    contact: 'alex.rivera@campus.edu | (555) 234-5678',
    status: 'Lost',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'mock_2',
    itemName: 'Student Campus ID Card',
    type: 'Found',
    category: 'Documents/ID Cards',
    description: 'Student ID card belonging to Marcus Chen, Engineering Dept. Handed over to student center reception desk.',
    location: 'Student Union Cafeteria, Booth #7',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    contact: 'studentcenter.desk@campus.edu | Room 102',
    status: 'Found',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'mock_3',
    itemName: 'Thomas Calculus (14th Edition) Textbook',
    type: 'Found',
    category: 'Books',
    description: 'Hardcover textbook with sticky notes inside chapters 4 and 5. Found on a front row desk.',
    location: 'Science Complex, Lecture Hall 301',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    contact: 'prof.sanders.ta@campus.edu',
    status: 'Found',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'mock_4',
    itemName: 'Black Fossil Leather Wallet',
    type: 'Lost',
    category: 'Accessories',
    description: 'Bifold leather wallet containing driver license and transit card. Please reach out if found, urgent!',
    location: 'Athletic Center, Basketball Court bleachers',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    contact: 'jordan.lee@campus.edu | (555) 876-5432',
    status: 'Lost',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'mock_5',
    itemName: 'Navy Blue College Varsity Hoodie',
    type: 'Lost',
    category: 'Clothing',
    description: 'Size Medium university embroidered hoodie. Left on the bench during afternoon practice.',
    location: 'Campus Track & Field Bleachers',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    contact: 'priya.patel@campus.edu',
    status: 'Lost',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'mock_6',
    itemName: 'Texas Instruments TI-84 Plus CE Calculator',
    type: 'Found',
    category: 'Electronics',
    description: 'Black graphing calculator with bright yellow battery cover. Found under seat 18.',
    location: 'Mathematics Building, Room 204',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    contact: 'mathdept.office@campus.edu | (555) 345-6789',
    status: 'Found',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'mock_7',
    itemName: 'Hydro Flask 32oz Water Bottle',
    type: 'Lost',
    category: 'Other',
    description: 'Cobalt blue insulated flask covered with tech and national park stickers.',
    location: 'Campus Recreation Center Gym',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    contact: 'sam.taylor@campus.edu',
    status: 'Lost',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'mock_8',
    itemName: 'Car Keys with Blue University Lanyard',
    type: 'Found',
    category: 'Other',
    description: 'Key fob with Honda logo and two house keys attached to official blue campus lanyard.',
    location: 'North Parking Lot near Gate B',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    contact: 'campus.security@campus.edu | Emergency Ext: 4444',
    status: 'Returned',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

/**
 * Helper: Check if MongoDB is connected
 */
const isMongoConnected = () => mongoose.connection.readyState === 1;

/**
 * Helper: Validate MongoDB ObjectId or Mock ID
 */
const isValidId = (id) => {
  if (!id) return false;
  if (typeof id === 'string' && id.startsWith('mock_')) return true;
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * @route   GET /api/items
 * @desc    Get all items with optional search and filters
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { search, status, category, type } = req.query;

    if (isMongoConnected()) {
      const query = {};

      if (status && status !== 'All') {
        query.status = status;
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (type && type !== 'All') {
        query.type = type;
      }

      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { itemName: searchRegex },
          { description: searchRegex },
          { location: searchRegex }
        ];
      }

      const items = await Item.find(query).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: items.length,
        source: 'mongodb',
        data: items
      });
    }

    // In-Memory Fallback
    let filtered = [...inMemoryItems];

    if (status && status !== 'All') {
      filtered = filtered.filter((item) => item.status === status);
    }

    if (category && category !== 'All') {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (type && type !== 'All') {
      filtered = filtered.filter((item) => item.type === type);
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.itemName.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: filtered.length,
      source: 'in-memory-fallback',
      data: filtered
    });
  } catch (error) {
    console.error('Error fetching items:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch items.',
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

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID format.'
      });
    }

    if (isMongoConnected()) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const item = await Item.findById(id);
        if (item) {
          return res.status(200).json({
            success: true,
            source: 'mongodb',
            data: item
          });
        }
      }
    }

    // Check in-memory store
    const item = inMemoryItems.find((i) => i._id.toString() === id.toString());

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    return res.status(200).json({
      success: true,
      source: isMongoConnected() ? 'mongodb' : 'in-memory-fallback',
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

    // Determine initial status
    const initialStatus = status || (type === 'Found' ? 'Found' : 'Lost');

    if (isMongoConnected()) {
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
        message: 'Item reported successfully in MongoDB.',
        source: 'mongodb',
        data: savedItem
      });
    }

    // In-memory fallback create
    const now = new Date().toISOString();
    const newItem = {
      _id: `mock_${Date.now()}`,
      itemName: itemName.trim(),
      type,
      category: category.trim(),
      description: description.trim(),
      location: location.trim(),
      date: new Date(date).toISOString(),
      contact: contact.trim(),
      status: initialStatus,
      createdAt: now,
      updatedAt: now
    };

    inMemoryItems.unshift(newItem);

    return res.status(201).json({
      success: true,
      message: 'Item reported successfully.',
      source: 'in-memory-fallback',
      data: newItem
    });
  } catch (error) {
    console.error('Error creating item:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
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

    if (!isValidId(id)) {
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

    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
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

      if (updatedItem) {
        return res.status(200).json({
          success: true,
          message: 'Item updated successfully in MongoDB.',
          source: 'mongodb',
          data: updatedItem
        });
      }
    }

    // Update in-memory item
    const idx = inMemoryItems.findIndex((i) => i._id.toString() === id.toString());

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    const existing = inMemoryItems[idx];
    const updated = {
      ...existing,
      ...(itemName !== undefined && { itemName: itemName.trim() }),
      ...(type !== undefined && { type }),
      ...(category !== undefined && { category: category.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(location !== undefined && { location: location.trim() }),
      ...(date !== undefined && { date: new Date(date).toISOString() }),
      ...(contact !== undefined && { contact: contact.trim() }),
      ...(status !== undefined && { status }),
      updatedAt: new Date().toISOString()
    };

    inMemoryItems[idx] = updated;

    return res.status(200).json({
      success: true,
      message: 'Item updated successfully.',
      source: isMongoConnected() ? 'mongodb' : 'in-memory-fallback',
      data: updated
    });
  } catch (error) {
    console.error('Error updating item:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
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

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID format.'
      });
    }

    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const deletedItem = await Item.findByIdAndDelete(id);

      if (deletedItem) {
        return res.status(200).json({
          success: true,
          message: 'Item deleted successfully from MongoDB.',
          source: 'mongodb',
          data: deletedItem
        });
      }
    }

    // Delete from in-memory store
    const idx = inMemoryItems.findIndex((i) => i._id.toString() === id.toString());

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    const removed = inMemoryItems.splice(idx, 1)[0];

    return res.status(200).json({
      success: true,
      message: 'Item deleted successfully.',
      source: isMongoConnected() ? 'mongodb' : 'in-memory-fallback',
      data: removed
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
