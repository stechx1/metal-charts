import { getCookie } from "cookies-next";
import User from "../../../../models/User";
import Sell from "../../../../models/Sell";
// database
import database from "../../../../lib/database";

export default async function handler(req, res) {
  try {
    // database
    await database();

    switch (req.method) {
      case "GET": {
        const { amount } = await req.query;
        console.log(amount);

        const trades = await User.aggregate([
          {
            $project: {
              username: 1,
              token: 1,
            },
          },
          {
            $lookup: {
              from: "sells",
              let: { userId: "$token" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$amount", Number(amount)] },
                        { $eq: ["$seller", "$$userId"] },
                        { $eq: ["$commodity", "UKOIL"] },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    tradewith: 1,
                    amount: 1,
                    duration: 1,
                    qty: 1,
                    commodity: 1,
                  },
                },
              ],
              as: "trade",
            },
          },
        ]);

        const data = trades.filter((item) => {
          console.log("item: ", item);
          return item.trade.length > 0;
        });

        return res.send(data);
      }
      case "POST": {
        const orderData = await req.body;
        console.log(orderData);
        const token = getCookie("user", { req, res });
        const sellData = new Sell({
          seller: token,
          tradewith: orderData.type,
          amount: orderData.amount,
          qty: orderData.qty,
          commodity: orderData.commodity,
          duration: orderData.duration,
        });

        const response = await sellData.save();

        return res.status(201).send(response);
      }
      default: {
        return res.json({ message: "Invalid Request Method" });
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
}
