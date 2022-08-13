const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.models("Conversation", ConversationSchema);

export default mongoose.models.conversation ||
  mongoose.model("conversation", ConversationSchema);
