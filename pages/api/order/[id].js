import { info } from "autoprefixer";
import database from "../../../lib/database";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  const orderId = req.query;
  console.log("Order ID", orderId)
  try {
    await database();
    
    if(req.method === "GET") {
      const order = await Order.find({
        orderId: orderId,
      })
      return res.status(200).json(order);
    }
    
  } catch (err) {
    console.log(err);
    res.json({message: err.message})
  }
}