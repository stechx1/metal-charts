// database
import database from "../../../lib/database";
import Bank from "../../../models/Bank";

export default async function handler(req, res) {
  const token = req.body.sellerToken;
  console.log("Token in API", token)
  try {
    // database
    await database();
    
    switch (req.method) { 
      case "POST": {
        const bankDetails = await Bank.findOne({token})
        res.status(200).json(bankDetails);
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
}
