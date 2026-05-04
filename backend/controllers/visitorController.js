const Visitor = require('../models/Visitor');

/**
 * Create a new visitor/pickup appointment
 * POST /api/visitors
 */
const createVisitor = async (req, res) => {
  try {
    const { visitorName, phone, email, purpose, visitDate, visitTime, relatedBookingId, notes } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!visitorName || !phone || !purpose || !visitDate || !visitTime) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const visitor = await Visitor.create({
      userId,
      visitorName,
      phone,
      email: email || '',
      purpose,
      visitDate,
      visitTime,
      relatedBookingId: relatedBookingId || null,
      notes: notes || '',
    });

    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all visitor records
 * GET /api/visitors
 */
const getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .populate('relatedBookingId', 'status')
      .sort({ createdAt: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get current user's visits
 * GET /api/visitors/my-visits
 */
const getMyVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({ userId: req.user._id })
      .populate('relatedBookingId', 'status')
      .sort({ createdAt: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get single visitor by ID
 * GET /api/visitors/:id
 */
const getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate('relatedBookingId', 'status');
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update visitor status
 * PUT /api/visitors/:id/status
 */
const updateVisitorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

    if (status) visitor.status = status;

    await visitor.save();
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a visitor record
 * DELETE /api/visitors/:id
 */
const deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

    await visitor.deleteOne();
    res.json({ message: 'Visitor record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createVisitor, 
  getAllVisitors, 
  getMyVisitors,
  getVisitorById, 
  updateVisitorStatus, 
  deleteVisitor 
};
