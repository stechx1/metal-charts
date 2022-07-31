import { getCookie } from "cookies-next";
import UserCommodity from "../../../models/UserCommodity";
// database
import database from "../../../lib/database";

export default async function handler(req, res) {
  try {
    // database
    await database();

    switch (req.method) {
      case "GET": {
        const token = getCookie("user", { req, res });

        const balance = await UserCommodity.findOne({
          token: token,
          commodity: "gold",
        }, "amount");

        return res.send(balance);
      }
      case "POST": {
        const orderData = await req.body;

        return res.status(201).send("");
      }
      default: {
        return res.json({ message: "Invalid Request Method" });
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
}
