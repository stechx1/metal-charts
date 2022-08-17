import { getCookie } from "cookies-next";
import database from "../../../lib/database";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  const order = req.body;
  const token = getCookie("user", { req, res });

  try {
    await database();

    if (req.method === "POST") {
      const balance = await UserCommodity.findOne({
        token: token,
        commodity: orderData.commodity,
      });

      if (balance && balance.amount >= orderData.qty) {
      const newOrder = new Order(order);
      const savedOrder = await newOrder.save();
      return res.status(200).json(savedOrder);
    }
    }
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
}
