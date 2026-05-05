const Booking = require('../models/Booking');
const Item = require('../models/Item');

/**
 * Create a new booking request (Customer)
 * POST /api/bookings
 */
const createBooking = async (req, res) => {
  try {
    const { itemId, rentalStartDate, rentalEndDate, totalAmount, notes } = req.body;

    if (!rentalStartDate || !rentalEndDate || totalAmount === undefined || totalAmount === null) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    let item = null;
    if (itemId) {
      item = await Item.findById(itemId);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      if (item.availabilityStatus !== 'Available') {
        return res.status(400).json({ message: 'Item is not available for booking' });
      }
      if (item.stockQuantity <= 0) {
        return res.status(400).json({ message: 'Item is out of stock' });
      }
    }

    const booking = await Booking.create({
      userId: req.user._id,
      itemId,
      rentalStartDate,
      rentalEndDate,
      totalAmount,
      notes,
    });

    // Reduce stock and update availability if it's an item booking
    if (item) {
      item.stockQuantity -= 1;
      if (item.stockQuantity === 0) {
        item.availabilityStatus = 'Booked';
      }
      await item.save();
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get current user's bookings (Customer)
 * GET /api/bookings/my-bookings
 */
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('itemId', 'itemName category image price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all bookings (Admin)
 * GET /api/bookings
 */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
      .populate('itemId', 'itemName category image')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get single booking by ID
 * GET /api/bookings/:id
 */
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('itemId', 'itemName category image price');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update booking status (Admin)
 * PUT /api/bookings/:id/status
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    if (adminNote !== undefined) booking.adminNote = adminNote;
    await booking.save();

    // If approved, check if we need to mark as Booked (out of stock)
    if (status === 'Approved') {
      const item = await Item.findById(booking.itemId);
      if (item) {
        // If stock is already 0, it should have been handled at creation,
        // but let's ensure consistency.
        if (item.stockQuantity === 0) {
          item.availabilityStatus = 'Booked';
          await item.save();
        }
      }
    }

    // If rejected or cancelled, restore stock
    if (status === 'Rejected' || status === 'Cancelled') {
      const item = await Item.findById(booking.itemId);
      if (item) {
        item.stockQuantity += 1;
        item.availabilityStatus = 'Available';
        await item.save();
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Cancel booking (Customer)
 * PUT /api/bookings/:id/cancel
 */
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    // Restore item stock
    const item = await Item.findById(booking.itemId);
    if (item) {
      item.stockQuantity += 1;
      item.availabilityStatus = 'Available';
      await item.save();
    }

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a booking (Admin)
 * DELETE /api/bookings/:id
 */
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    await booking.deleteOne();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
};
