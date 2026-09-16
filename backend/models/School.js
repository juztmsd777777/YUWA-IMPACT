import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, default: "" },
    programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
  },
  { timestamps: true }
);

export default mongoose.model("School", schoolSchema);
