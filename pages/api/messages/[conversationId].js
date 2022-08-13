// database
import database from "../../../lib/database";
import Message from "../../../models/Message";

export default async function handler(req, res) {
  const conversationId = req.query.conversationId;
  try {
    // database
    await database();

    switch (req.method) {
      case "GET": {
        const messages = await Message.find({
          conversationId: conversationId,
        });
        res.status(200).json(messages);
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
}
