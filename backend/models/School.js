import mongoose from "mongoose";

/**
 * School Schema
 * Represents educational institutions registered in YUWA programs (Ecolympics & Green Gurukul).
 */
const schoolSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    district: {
      type: String,
      trim: true,
      default: ''
    },
    state: {
      type: String,
      trim: true,
      default: ''
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
      enum: {
        values: ['Ecolympics', 'Green Gurukul', 'Both'],
        message: '{VALUE} is not a supported program. Must be Ecolympics, Green Gurukul, or Both'
      },
      default: 'Both'
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Keep name and schoolName mutually synchronized for dashboard & API compatibility
schoolSchema.pre('validate', function (next) {
  if (!this.schoolName && this.name) {
    this.schoolName = this.name;
  }
  if (!this.name && this.schoolName) {
    this.name = this.schoolName;
  }
  if (!this.schoolName && !this.name) {
    this.invalidate('schoolName', 'School name is required');
  }
  next();
});

const School = mongoose.models.School || mongoose.model('School', schoolSchema);

export default School;
export { School };

