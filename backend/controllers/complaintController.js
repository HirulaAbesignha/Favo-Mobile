const Complaint = require('../models/Complaint');

/**
 * Create a new complaint (Customer)
 * POST /api/complaints
 */
const createComplaint = async (req, res) => {
  try {
    const { bookingId, subject, description, image } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ message: 'Please provide subject and description' });
    }

    const complaint = await Complaint.create({
      userId: req.user._id,
      bookingId: bookingId || null,
      subject,
      description,
      image: image || '',
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get current user's complaints (Customer)
 * GET /api/complaints/my-complaints
 */
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .populate('bookingId', 'status')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all complaints (Admin)
 * GET /api/complaints
 */
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('userId', 'name email')
      .populate('bookingId', 'status')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get single complaint by ID
 * GET /api/complaints/:id
 */
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('bookingId', 'status');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update complaint status and admin response (Admin)
 * PUT /api/complaints/:id/status
 */
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (status) complaint.status = status;
    if (adminResponse !== undefined) complaint.adminResponse = adminResponse;

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a complaint (Admin)
 * DELETE /api/complaints/:id
 */
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
};
