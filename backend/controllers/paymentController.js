const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const generateTransactionId = require('../utils/generateTransactionId');

/**
 * Create a new payment (Customer)
 * POST /api/payments
 */
const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;

    if (!bookingId || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const booking = await Booking.findOne({ _id: bookingId, userId: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const payment = await Payment.create({
      userId: req.user._id,
      bookingId,
      amount,
      paymentMethod,
      transactionId: generateTransactionId(),
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get current user's payment history (Customer)
 * GET /api/payments/my-payments
 */
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('bookingId', 'status rentalStartDate rentalEndDate')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all payments (Admin)
 * GET /api/payments
 */
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .populate('bookingId', 'status')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get single payment by ID
 * GET /api/payments/:id
 */
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('bookingId', 'status');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update payment status (Admin)
 * PUT /api/payments/:id/status
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.paymentStatus = paymentStatus;
    await payment.save();

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a payment record (Admin)
 * DELETE /api/payments/:id
 */
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    await payment.deleteOne();
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayment,
  getMyPayments,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
};
