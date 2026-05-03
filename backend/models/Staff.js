const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    staffName: {
      type: String,
      required: [true, 'Staff name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    assignedDepartment: {
      type: String,
      required: [true, 'Assigned department is required'],
      trim: true,
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Busy', 'Inactive'],
      default: 'Available',
    },
    profileImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Staff', staffSchema);
