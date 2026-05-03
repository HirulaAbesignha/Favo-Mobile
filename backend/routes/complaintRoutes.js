const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/', protect, createComplaint);
router.get('/my-complaints', protect, getMyComplaints);
router.get('/', protect, adminOnly, getAllComplaints);
router.get('/:id', protect, getComplaintById);
router.put('/:id/status', protect, adminOnly, updateComplaintStatus);
router.delete('/:id', protect, adminOnly, deleteComplaint);

module.exports = router;
