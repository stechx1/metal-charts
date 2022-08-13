const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.models("Message", MessageSchema);

export default mongoose.models.message ||
  mongoose.model("message", MessageSchema);
