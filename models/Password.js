import mongoose from "mongoose";
const Schema = mongoose.Schema;

const passwordSchema = new Schema({
  userid: {
    type: mongoose.ObjectId,
    required: true,
  },
  status: {
    type: String,
    default: "active",
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.models.password ||
  mongoose.model("password", passwordSchema);
