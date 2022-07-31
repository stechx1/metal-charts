import { getCookie } from "cookies-next";
import User from "../../../../models/User";
import Buymetalchart from "../../../../models/Buymetalchart";
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
                  },
                },
              ],
              as: "trade",
            },
          },
        ]);

        const data = trades.filter((item) => {
          return item.trade.length > 0;
        });

        return res.send(data);
      }

      case "POST": {
        const orderData = await req.body;
        // console.log(orderData);
        const token = getCookie("user", { req, res });

        const buyData = new Buymetalchart({
          buyer: token,
          amount: orderData.amount,
          qty: orderData.qty,
          commodity: orderData.commodity,
          payment: orderData.payment,
        });
        // console.log("buyData", buyData);

        const response = await buyData.save();

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
