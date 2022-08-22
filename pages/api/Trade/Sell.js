import { getCookie } from "cookies-next";
import User from "../../../models/User";
import Sell from "../../../models/Sell";
// database
import database from "../../../lib/database";
import UserCommodity from "../../../models/UserCommodity";
import Buyp2p from "../../../models/Buyp2p";
import nodemailer from "nodemailer";

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

        const buyRequest = new Buyp2p({
          seller: response.seller,
          buyer: token,
          trx_id: orderData.trx_id,
          orderid: response._id,
        });
        const buyResponse = await buyRequest.save();

        let foundSeller = await User.findOne({ token: response.seller });
        let foundBuyer = await User.findOne({ token });

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.Nodemail_Username,
            pass: process.env.Nodemail_App_Password,
          },
        });
        let info = await transporter.sendMail({
          from: `MetalCharts ${process.env.Nodemail_Username}`,
          to: foundSeller?.email,
          subject: `${foundBuyer?.name} Bought Your comodity`,
          html: `<!DOCTYPE html>
          <html lang="en-US">
            <head>
              <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
              <title>${foundBuyer?.name} Bought Your comodity</title>
              <meta name="description" content="Reset Password Email Template." />
              <style type="text/css">
                a:hover {
                  text-decoration: underline !important;
                }
              </style>
            </head>

            <body
              marginheight="0"
              topmargin="0"
              marginwidth="0"
              style="margin: 0px; background-color: #f2f3f8"
              leftmargin="0"
            >
              <!--100% body table-->
              <table
                cellspacing="0"
                border="0"
                cellpadding="0"
                width="100%"
                bgcolor="#f2f3f8"
                style="
                  @import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700);
                  font-family: 'Open Sans', sans-serif;
                "
              >
                <tr>
                  <td>
                    <table
                      style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto"
                      width="100%"
                      border="0"
                      align="center"
                      cellpadding="0"
                      cellspacing="0"
                    >
                      <tr>
                        <td style="height: 80px">&nbsp;</td>
                      </tr>
                      <tr>
                        <td style="text-align: center">
                          <a
                            href="https://metalcharts-1.herokuapp.com"
                            title="logo"
                            target="_blank"
                            style="text-decoration: none !important;; color: #eab308; font-size: 24px;"
                          >
                            <h2>MetalCharts</h2>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 20px">&nbsp;</td>
                      </tr>
                      <tr>
                        <td>
                          <table
                            width="95%"
                            border="0"
                            align="center"
                            cellpadding="0"
                            cellspacing="0"
                            style="
                              max-width: 670px;
                              background: #fff;
                              border-radius: 3px;
                              text-align: center;
                              -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                              -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                              box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                            "
                          >
                            <tr>
                              <td style="height: 40px">&nbsp;</td>
                            </tr>
                            <tr>
                              <td style="padding: 0 35px">
                                <h1
                                  style="
                                    color: #1e1e2d;
                                    font-weight: 500;
                                    margin: 0;
                                    font-size: 32px;
                                    font-family: 'Rubik', sans-serif;
                                  "
                                >
                                  ${foundBuyer?.name} Bought your comodity
                                </h1>
                                <span
                                  style="
                                    display: inline-block;
                                    vertical-align: middle;
                                    margin: 29px 0 26px;
                                    border-bottom: 1px solid #cecece;
                                    width: 100px;
                                  "
                                ></span>
                                <p style="
                                color: #455056;
                                font-size: 15px;
                                line-height: 24px;
                                text-align:left;
                                ">Hi ${foundSeller?.name}</p>
                                <p
                                  style="
                                    color: #455056;
                                    font-size: 15px;
                                    line-height: 24px;
                                    text-align:left;
                                  "
                                >
                                ${foundBuyer?.name} has paid you this ${response?.amount} amount and bought this ${response.qty} quantity of your commodity. Click on the link to view the request
                                </p>
                                <a
                                  href="http://localhost:3001/user/view-request/${buyResponse?._id}"
                                  style="
                                    text-align:left;
                                    background: #020b48;
                                    text-decoration: none !important;
                                    font-weight: 500;
                                    margin-top: 35px;
                                    color: #fff;
                                    text-transform: uppercase;
                                    font-size: 14px;
                                    padding: 10px 24px;
                                    display: inline-block;
                                    border-radius: 50px;
                                  "
                                  >Check Detials</a
                                >
                              </td>
                            </tr>
                            <tr>
                              <td style="height: 40px">&nbsp;</td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td style="height: 20px">&nbsp;</td>
                      </tr>
                      <tr>
                        <td style="text-align: center">
                          <p
                            style="
                              font-size: 14px;
                              color: rgba(69, 80, 86, 0.7411764705882353);
                              line-height: 18px;
                              margin: 0 0 0;
                            "
                          >
                            &copy; <strong>www.metalcharts.net</strong>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 80px">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!--/100% body table-->
            </body>
          </html>
          `,
        });

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
