import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    score: { type: Number },
    localId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.model("Participant", participantSchema);
