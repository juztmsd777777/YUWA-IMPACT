import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    participantId: { type: mongoose.Schema.Types.ObjectId, ref: "Participant" },
    programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
    beforeScore: { type: Number },
    afterScore: { type: Number },
    localId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.model("Assessment", assessmentSchema);
