import { getCookie } from "cookies-next";
import Buyp2p from "../../../../models/Buyp2p";
import Buymetalchart from "../../../../models/Buymetalchart";
// database
import database from "../../../../lib/database";

export default async function handler(req, res) {
  try {
    // database
    await database();

    switch (req.method) {
      case "GET": {
        const user = await getCookie("user", { req, res });

        let metalcharts = await Buymetalchart.find({
          buyer: user,
        });

        let p2p = await Buyp2p.aggregate([
          {
            $match: {
              buyer: user,
            },
          },
          {
            $project: {
              order_id: { $toObjectId: "$orderid" },
              order_status: "$status",
              order_date: "$created_at",
            },
          },
          {
            $lookup: {
              from: "sells",
              localField: "order_id",
              foreignField: "_id",
              as: "order",
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [{ $arrayElemAt: ["$order", 0] }, "$$ROOT"],
              },
            },
          },
          {
            $project: { order: 0 },
          },
          {
            $project: {
              order_id: 1,
              status:"$order_status",
              created_at: "$order_date",
              tradewith:1,
              amount: 1,
              qty: 1,
              commodity: 1,
            },
          },
        ]);

        return res.send({
          metalcharts,
          p2p,
        });
      }
      default: {
        return res.json({ message: "Invalid Request Method" });
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
}
