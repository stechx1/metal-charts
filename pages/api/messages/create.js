// database
import database from "../../../lib/database";
import Message from "../../../models/Message";
// database

export default async function handler(req, res) {
  try {
    // database
    await database();

    switch (req.method) {
      // New conversation
      case "POST": {
        const newMessage = new Message(req.body);

        const savedMessage = await newMessage.save();
        return res.status(200).json(savedMessage);
      }
    }
  } catch (error) {
    console.log("Error:", error);
    res.json({ message: error.message });
  }
}
