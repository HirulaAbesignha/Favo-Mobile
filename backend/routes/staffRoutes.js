const express = require('express');
const router = express.Router();
const {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/', protect, adminOnly, createStaff);
router.get('/', protect, adminOnly, getAllStaff);
router.get('/:id', protect, adminOnly, getStaffById);
router.put('/:id', protect, adminOnly, updateStaff);
router.delete('/:id', protect, adminOnly, deleteStaff);

module.exports = router;
