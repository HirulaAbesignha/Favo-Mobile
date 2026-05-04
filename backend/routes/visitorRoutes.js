const express = require('express');
const router = express.Router();
const {
  createVisitor,
  getAllVisitors,
  getMyVisitors,
  getVisitorById,
  updateVisitorStatus,
  deleteVisitor,
} = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/', protect, createVisitor);
router.get('/my-visits', protect, getMyVisitors);
router.get('/', protect, adminOnly, getAllVisitors);
router.get('/:id', protect, getVisitorById);
router.put('/:id/status', protect, adminOnly, updateVisitorStatus);
router.delete('/:id', protect, adminOnly, deleteVisitor);

module.exports = router;
