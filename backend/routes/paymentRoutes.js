const express = require('express');
const router = express.Router();
const {
  createPayment,
  getMyPayments,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/', protect, createPayment);
router.get('/my-payments', protect, getMyPayments);
router.get('/', protect, adminOnly, getAllPayments);
router.get('/:id', protect, getPaymentById);
router.put('/:id/status', protect, adminOnly, updatePaymentStatus);
router.delete('/:id', protect, adminOnly, deletePayment);

module.exports = router;
