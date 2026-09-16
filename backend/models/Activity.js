import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    activityType: { type: String, required: true },
    date: { type: Date },
    participants: { type: Number, default: 0 },
    averageScore: { type: Number },
    notes: { type: String, default: "" },
    photos: { type: [String], default: [] },
    localId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
