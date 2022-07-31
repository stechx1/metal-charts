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
        const token = getCookie("user", { req, res });
        const bank = await Bank.findOne(
          { token },
          "type name account bank currency"
        );

        if (bank) {
          const data = {
            type: bank.type,
            name: bank.name,
            account_number: bank.account,
            bank_code: bank.bank,
            currency: bank.currency,
          };
          console.log("data", data);

          const response = await axios.post(
            "https://api.paystack.co/transferrecipient",
            data,
            {
              headers: {
                Authorization: "Bearer " + process.env.SECRET_KEY,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("response", response.data);

          return res.status(201).send(response.data);
        } else {
          return res.status(204).end();
        }
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
