// database
import { getCookie } from "cookies-next";
import database from "../../../lib/database";
import Bank from "../../../models/Bank";
import User from "../../../models/User";

export default async function handler(req, res) {
  const token = req.body.sellerToken;
  console.log("Token in API", token);
  try {
    // database
    await database();

    switch (req.method) {
      case "POST": {
        const bankDetails = await Bank.findOne({ token });
        res.status(200).json(bankDetails);
      }
      case "GET": {
        const { sellerToken } = req.query;
        const sellerDetails = await User.findOne({ token: sellerToken });
        res.status(200).json(sellerDetails);
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
}
