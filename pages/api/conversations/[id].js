// database
import database from "../../../lib/database";
import Conversation from "../../../models/Conversation";

export default async function handler(req, res) {
  const userId = req.query.id;
  try {
    // database
    await database();
    
    switch (req.method) {
      // New conversation 
      case "GET": {
        const conversations = await Conversation.find({
          members: { $in: [userId]}
        })
        res.status(200).json(conversations);

      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
}
