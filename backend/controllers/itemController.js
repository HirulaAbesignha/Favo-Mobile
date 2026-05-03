const Item = require('../models/Item');

/**
 * Create a new fashion item (Admin only)
 * POST /api/items
 */
const createItem = async (req, res) => {
  try {
    const itemData = { ...req.body, createdBy: req.user._id };
    const item = await Item.create(itemData);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all items with optional filters
 * GET /api/items
 */
const getItems = async (req, res) => {
  try {
    const { category, size, availabilityStatus } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (size) filter.size = size;
    if (availabilityStatus) filter.availabilityStatus = availabilityStatus;

    const items = await Item.find(filter).populate('createdBy', 'name email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get single item by ID
 * GET /api/items/:id
 */
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('createdBy', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update an item (Admin only)
 * PUT /api/items/:id
 */
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Auto-update availability if stock is 0
    if (req.body.stockQuantity !== undefined && req.body.stockQuantity === 0) {
      req.body.availabilityStatus = 'Maintenance';
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete an item (Admin only)
 * DELETE /api/items/:id
 */
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Upload item image
 * POST /api/items/:id/upload
 */
const uploadItemImage = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    item.image = imageUrl;
    await item.save();

    res.json({ message: 'Image uploaded successfully', image: imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createItem, getItems, getItemById, updateItem, deleteItem, uploadItemImage };
