const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    itemType: {
      type: String,
      enum: ['Product', 'Service'],
      default: 'Product',
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    sizes: [
      {
        size: { type: String, required: true },
        stock: { type: Number, default: 0, min: 0 },
      }
    ],
    color: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
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
      default: 0,
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Sold', 'Unavailable', 'Maintenance'],
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

itemSchema.pre('save', function (next) {
  if (this.sizes && this.sizes.length > 0) {
    this.stockQuantity = this.sizes.reduce((acc, s) => acc + s.stock, 0);
  }
  next();
});

module.exports = mongoose.model('Item', itemSchema);
