import axios from "axios";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "POST": {
        const data = req.body;
        const email = data.email;
        const name = data.name;
        const message = data.message;

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
          to: process.env.Nodemail_Reciever,
          subject: "MetalCharts Contact Form",
          html:
            "<b>Email: </b>" +
            email +
            "<br>" +
            "<b>Name: </b>" +
            name +
            "<br>" +
            "<b>Message: </b>" +
            message,
        });

        // console.log("info", info.messageId);

        res.status(201).send(info);
      }
      default: {
        return res.json({ message: "Request Method not defined!" });
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
}
