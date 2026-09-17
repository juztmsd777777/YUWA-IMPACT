const mongoose = require('mongoose');

/**
 * School Schema
 * Represents educational institutions registered in YUWA programs (Ecolympics & Green Gurukul).
 */
const schoolSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: [true, 'School name is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'School location/address is required'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    contactPerson: {
      type: String,
      trim: true,
      default: ''
    },
    contactPhone: {
      type: String,
      trim: true,
      default: ''
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    program: {
      type: String,
      required: [true, 'Program is required'],
      enum: {
        values: ['Ecolympics', 'Green Gurukul', 'Both'],
        message: '{VALUE} is not a supported program. Must be Ecolympics, Green Gurukul, or Both'
      },
      default: 'Both'
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

const School = mongoose.model('School', schoolSchema);

module.exports = School;
