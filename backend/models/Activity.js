import mongoose from "mongoose";

/**
 * Activity Schema
 * Represents events and sessions conducted at schools (e.g. Waste Audit, Cleanliness Drive).
 * Links directly to School, records participant involvement, and stores photo evidence links.
 */
const activitySchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'School'
    },
    schoolName: {
      type: String,
      trim: true,
      default: ''
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program'
    },
    program: {
      type: String,
      default: 'Ecolympics'
    },
    programName: {
      type: String,
      default: ''
    },
    activityName: {
      type: String,
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    activityType: {
      type: String,
      default: 'Other'
    },
    date: {
      type: Date,
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
    participantsCount: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    participants: [
      {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Participant'
      }
    ],
    photos: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

activitySchema.pre('validate', function (next) {
  const chosenName = this.activityName || this.name || this.title || 'YUWA Activity';
  if (!this.activityName) this.activityName = chosenName;
  if (!this.name) this.name = chosenName;
  if (!this.title) this.title = chosenName;

  if (this.participantCount && !this.participantsCount) {
    this.participantsCount = this.participantCount;
  } else if (this.participantsCount && !this.participantCount) {
    this.participantCount = this.participantsCount;
  }
  next();
});

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

export default Activity;
export { Activity };

