import { getCookie } from "cookies-next";
import database from "../../../lib/database.js";
import User from "../../../models/User.js";
import Bank from "../../../models/Bank.js";
import axios from "axios";

export default async function handler(req, res) {
  try {
    // database
    await database();

    switch (req.method) {
      case "POST": {
        const { recipient, amount } = req.body;
        const data = JSON.stringify({
          source: "balance",
          // currency: "NGN",
          reason: "MetalChart Trade",
          // amount: amount,
          amount: 3794800,
          recipient: recipient,
        });
        console.log("data: ", data);

        const response = await axios.post(
          "https://api.paystack.co/transfer",
          data,
          {
            headers: {
              Authorization: "Bearer " + process.env.SECRET_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        return res.status(201).send(response.data);
      }
      default: {
        return res.json({ message: "Invalid Request Method" });
      }
    }
  } catch (error) {
    console.log("message", error.message);
    res.json({ message: error.message });
  }
}
