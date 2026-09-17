import mongoose from "mongoose";

/**
 * Participant Schema
 * Represents a student or youth participant in YUWA programs (Ecolympics, Green Gurukul).
 * Has a direct relationship to the School where they study.
 */
const participantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    fullName: {
      type: String,
      trim: true
    },
    age: {
      type: Number,
      min: [4, 'Age must be at least 4'],
      max: [35, 'Age cannot exceed 35'],
      default: 12
    },
    gender: {
      type: String,
      default: 'Prefer not to say'
    },
    schoolId: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'School'
    },
    schoolName: {
      type: String,
      trim: true,
      default: ''
    },
    gradeOrClass: {
      type: String,
      trim: true,
      default: ''
    },
    className: {
      type: String,
      trim: true,
      default: ''
    },
    contact: {
      type: String,
      trim: true,
      default: ''
    },
    score: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    program: {
      type: String,
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

participantSchema.pre('validate', function (next) {
  if (!this.name && this.fullName) {
    this.name = this.fullName;
  }
  if (!this.fullName && this.name) {
    this.fullName = this.name;
  }
  if (!this.gradeOrClass && this.className) {
    this.gradeOrClass = this.className;
  }
  if (!this.className && this.gradeOrClass) {
    this.className = this.gradeOrClass;
  }
  if (!this.name && !this.fullName) {
    this.name = 'Participant';
    this.fullName = 'Participant';
  }
  next();
});

const Participant = mongoose.models.Participant || mongoose.model('Participant', participantSchema);

export default Participant;
export { Participant };

