import { getCookie } from "cookies-next";
import database from "../../../lib/database.js";
import User from "../../../models/User.js";
import Bank from "../../../models/Bank.js";

export default async function handler(req, res) {
  try {
    // database
    await database();

    switch (req.method) {
      case "GET": {
        const token = getCookie("user", { req, res });
        const bank = await Bank.findOne({ token });
        return res.status(200).send(bank);
      }
      case "POST": {
        const token = getCookie("user", { req, res });
        const { id, name, email, account, bank, type, currency } =
          await req.body;

        const isExist = await Bank.findOne({ token });

        let bankData;
        if (isExist) {
          console.log("isExist", isExist);
          bankData = {
            bankid: id,
            email: email.toLowerCase(),
            name,
            account,
            bank,
            type,
            currency,
            updated_at: Date.now(),
          };

          const bankResponse = await Bank.findOneAndUpdate(
            { token: token },
            bankData,
            {
              new: true,
            }
          );

          return res.status(200).json(bankResponse);
        } else {
          bankData = await new Bank({
            bankid: id,
            email: email.toLowerCase(),
            name,
            account,
            bank, //bank code
            type,
            currency,
            token,
          });

          const bankResponse = await bankData.save();
          return res.status(201).json(bankResponse);
        }
      }
      case "PATCH": {
      }
      default: {
        return res.json({ message: "Request Method not defined!" });
      }
    }
  } catch (error) {
    console.log({ message: error.message });
    res.status(400).json({ message: error.message });
  }
}
