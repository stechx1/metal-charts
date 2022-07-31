import database from "../../../lib/database.js";
import User from "../../../models/User.js";
import Password from "../../../models/Password.js";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    // database
    await database();

    switch (req.method) {
      case "POST": {
        const { email } = await req.body;
        console.log("email", email);
        const user = await User.findOne({ email });

        console.log("user", user);

        if (user) {
          const passwordData = await new Password({
            userid: user._id,
          });
          const response = await passwordData.save();

          // send email
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
            to: user.email,
            subject: "Reset Password Request",
            html: `<!DOCTYPE html>
            <html lang="en-US">
              <head>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <title>Reset Password Email Template</title>
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
                                    You have requested to reset your password
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
                                  ">Hi ${user.name}</p>
                                  <p
                                    style="
                                      color: #455056;
                                      font-size: 15px;
                                      line-height: 24px;
                                      text-align:left;
                                    "
                                  >
                                    We cannot simply send you your old password. A unique
                                    link to reset your password has been generated for you.
                                    To reset your password, click the following link and
                                    follow the instructions.
                                  </p>


                                  <a
                                    href="http://localhost:3001/reset-password/${user._id}/${response._id}"
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
                                    >Reset Password</a
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
          return res.status(201).send({ uid: user._id, pid: response._id });
        } else {
          return res
            .status(200)
            .send({ message: "There is no user with this email account" });
        }
      }
      case "PATCH": {
        // updating password
        const { pass, cpass, pid, uid } = await req.body;

        if (pass && cpass && pass === cpass) {
          const paswrd = await Password.findOneAndUpdate(
            { _id: pid },
            { status: "used" },
            { new: true }
          );

          const userPass = await User.findOneAndUpdate(
            { _id: uid },
            { password: pass },
            { new: true }
          );

          return res
            .status(201)
            .send({ message: "Password has been updated." });
        } else {
          return res
            .status(200)
            .send({ message: "New and Confirm password doest not match." });
        }
      }
      default: {
        return res.json({ message: "Request Method not defined!" });
      }
    }
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
}
