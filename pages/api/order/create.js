import { info } from "autoprefixer";
import database from "../../../lib/database";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  const order = req.body;
  try {
    await database();

    if (req.method === "POST") {
      const newOrder = new Order(order);
      const savedOrder = await newOrder.save();
      return res.status(200).json(savedOrder);
    }
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
}
