const mongoose = require('mongoose');

/**
 * Participant Schema
 * Represents a student or youth participant in YUWA programs (Ecolympics, Green Gurukul).
 * Has a direct relationship to the School where they study.
 */
const participantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Participant name is required'],
      trim: true
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [4, 'Age must be at least 4'],
      max: [25, 'Age cannot exceed 25']
    },
    gender: {
      type: String,
      enum: {
        values: ['Male', 'Female', 'Other', 'Prefer not to say'],
        message: '{VALUE} is not a valid gender'
      },
      default: 'Prefer not to say'
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School', // Reference to the School model
      required: [true, 'School ID is required']
    },
    gradeOrClass: {
      type: String,
      trim: true,
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
    timestamps: true
  }
);

const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;
