import mongoose from "mongoose";

const activityReportSchema = new mongoose.Schema(
  {
    clientGeneratedId: {
      type: String,
      required: [true, "clientGeneratedId is required"],
      unique: true,
      index: true,
      trim: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "School",
      required: false,
    },
    programName: {
      type: String,
      required: [true, "programName is required"],
      enum: {
        values: [
          "Ecolympics",
          "Green Gurukul",
          "Waste Warriors Club",
          "Climate Awareness",
          "Other",
        ],
        message: "{VALUE} is not a supported program name",
      },
      trim: true,
    },
    studentCount: {
      type: Number,
      default: 0,
      min: [0, "studentCount cannot be negative"],
    },
    activityDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    photoUrls: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["synced", "draft", "flagged"],
      default: "synced",
      index: true,
    },
    clientCreatedAt: {
      type: Date,
      required: [true, "clientCreatedAt is required"],
    },
    syncedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for rapid offline synchronization lookups & reporting
activityReportSchema.index({ schoolId: 1, programName: 1 });
activityReportSchema.index({ clientGeneratedId: 1, syncedAt: -1 });

export default mongoose.model("ActivityReport", activityReportSchema);
