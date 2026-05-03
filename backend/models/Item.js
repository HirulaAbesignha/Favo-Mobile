const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    rentalPrice: {
      type: Number,
      required: [true, 'Rental price is required'],
      min: [0, 'Price cannot be negative'],
    },
    depositAmount: {
      type: Number,
      required: [true, 'Deposit amount is required'],
      min: [0, 'Deposit cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    stockQuantity: {
      type: Number,
      default: 1,
      min: [0, 'Stock cannot be negative'],
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Rented', 'Maintenance'],
      default: 'Available',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Item', itemSchema);
