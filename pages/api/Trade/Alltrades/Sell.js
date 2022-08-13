import { getCookie } from "cookies-next";
import Sell from "../../../../models/Sell";
// database
import database from "../../../../lib/database";

export default async function handler(req, res) {
  try {
    // database
    await database();

    switch (req.method) {
      case "GET": {
        const user = await getCookie("user", { req, res });

        let metalcharts = await Sell.find({
          seller: user,
          tradewith: "metalcharts",
        });

        let p2p = await Sell.find({
          seller: user,
          tradewith: "peer2peer",
        });

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
