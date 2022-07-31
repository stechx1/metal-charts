import { getCookie } from "cookies-next";
import User from "../../../models/User";
import Sell from "../../../models/Sell";
// database
import database from "../../../lib/database";
import UserCommodity from "../../../models/UserCommodity";
import Buyp2p from "../../../models/Buyp2p";

export default async function handler(req, res) {
  try {
    // database
    await database();

    switch (req.method) {
      case "GET": {
        const { amount, commodity } = await req.query;
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
                        { $eq: ["$tradewith", "peer2peer"] },
                        { $eq: ["$amount", Number(amount)] },
                        { $eq: ["$seller", "$$userId"] },
                        { $eq: ["$status", "waiting"] },
                        { $eq: ["$commodity", commodity] },
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
                    seller: 1,
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
        // selling commodity
        const orderData = await req.body;
        console.log(orderData);
        const token = getCookie("user", { req, res });
        // checking balance
        const balance = await UserCommodity.findOne({
          token: token,
          commodity: orderData.commodity,
        });

        if (balance && balance.amount >= orderData.qty) {
          // sending request
          const sellData = new Sell({
            seller: token,
            tradewith: orderData.type,
            amount: orderData.amount,
            qty: orderData.qty,
            commodity: orderData.commodity,
            duration: orderData.duration,
          });
          const response = await sellData.save();

          // deducting balance
          const comm = parseFloat(balance.amount) - parseFloat(orderData.qty);

          const balResponse = await UserCommodity.findOneAndUpdate(
            { token: token, commodity: orderData.commodity },
            { amount: comm },
            { new: true, upsert: true }
          );
          return res.status(201).send({ response, balResponse });
        } else {
          return res.status(200).json({ message: "Insufficient Balance" });
        }
      }
      case "PUT": {
        const orderData = await req.body;
        console.log("orderData", orderData);
        const token = getCookie("user", { req, res });

        // reserving his order
        const response = await Sell.findOneAndUpdate(
          { _id: orderData._id },
          { status: "pending" },
          { new: true }
        );

        // console.log()

        // sending request to admin
        const buyRequest = new Buyp2p({
          seller: response.seller,
          buyer: token,
          trx_id: orderData.trx_id,
          orderid: response._id,
        });
        const buyResponse = await buyRequest.save();

        return res.status(201).send({ response, buyResponse });
      }
      default: {
        return res.json({ message: "Invalid Request Method" });
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
}
