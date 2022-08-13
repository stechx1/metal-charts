import { info } from "autoprefixer";
import database from "../../../../lib/database";
import Order from "../../../../models/Order";

export default async function handler(req, res) {
  const orderId = req.query;
  const {status} = req.body;
  console.log("STATUS", status)
  try {
    await database();
    
    if(req.method === "PUT") {
      const newOrder = await Order.updateOne({
        orderId: orderId,
      }, {$set: {
        status
      }})
      return res.status(200).json(newOrder);
    }
    
  } catch (err) {
    console.log(err);
    res.json({message: err.message})
  }
}