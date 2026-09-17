const mongoose = require('mongoose');

/**
 * Activity Schema
 * Represents events and sessions conducted at schools (e.g. Waste Audit, Cleanliness Drive).
 * Links directly to School, records participant involvement, and stores photo evidence links.
 */
const activitySchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School ID is required']
    },
    program: {
      type: String,
      required: [true, 'Program is required'],
      enum: {
        values: ['Ecolympics', 'Green Gurukul'],
        message: '{VALUE} is not a valid program. Must be Ecolympics or Green Gurukul'
      }
    },
    activityName: {
      type: String,
      required: [true, 'Activity name is required'],
      trim: true
    },
    activityType: {
      type: String,
      required: [true, 'Activity type is required'],
      enum: {
        values: [
          'Waste Audit',
          'Cleanliness Drive',
          'Segregation Workshop',
          'Composting Session',
          'Upcycling Workshop',
          'Awareness Rally',
          'Quiz / Competition',
          'Other'
        ],
        message: '{VALUE} is not a valid activity type'
      }
    },
    date: {
      type: Date,
      required: [true, 'Activity date is required'],
      default: Date.now
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    participantCount: {
      type: Number,
      default: 0,
      min: [0, 'Participant count cannot be negative']
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participant'
      }
    ],
    photos: [
      {
        url: {
          type: String,
          trim: true
        },
        caption: {
          type: String,
          trim: true,
          default: ''
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
