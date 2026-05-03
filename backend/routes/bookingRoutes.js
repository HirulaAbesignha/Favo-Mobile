const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);
router.delete('/:id', protect, adminOnly, deleteBooking);

module.exports = router;
