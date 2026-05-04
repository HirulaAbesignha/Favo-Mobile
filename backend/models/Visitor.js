const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Allow null for walk-ins if needed, but usually tracked
    },
    visitorName: {
      type: String,
      required: [true, 'Visitor name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    purpose: {
      type: String,
      enum: ['Pickup', 'Return', 'Inquiry', 'Fitting'],
      required: [true, 'Purpose is required'],
    },
    visitDate: {
      type: Date,
      required: [true, 'Visit date is required'],
    },
    visitTime: {
      type: String,
      required: [true, 'Visit time is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Checked-In', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    relatedBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Visitor', visitorSchema);
