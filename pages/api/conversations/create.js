// database
import database from "../../../lib/database";
import Conversation from "../../../models/Conversation";

export default async function handler(req, res) {
  try {
    // database
    await database();
    
    switch (req.method) {
      // New conversation 
      case "POST": {
        const newConversation = new Conversation({
          members: [req.body.senderId, req.body.receiverId]
        })

        const savedConversation = await newConversation.save();
        return res.status(200).json(savedConversation);
      }
    }
  } catch (error) {
    res.json({message: error.message});
  }
}
