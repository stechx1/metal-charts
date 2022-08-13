// database
import database from "../../../lib/database";
// models
import User from "../../../models/User";
import KYC from "../../../models/KYC";
import UserCommodity from "../../../models/UserCommodity";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCookie, setCookies } from "cookies-next";

export default async function handler(req, res) {
  try {
    // database
    await database();

    switch (req.method) {
      case "GET":
        {
          // user login
          const { email, password } = await req.query;
          console.log(req.query);
          const isExist = await User.findOne({ email, password });
          console.log("isExist", isExist);
          if (!isExist) {
            return res.status(203).json({ message: "Wrong email or Password" });
          }

          // encrypting user data for cookie
          // const uname = isExist.username + Date.now();
          // const hashed_token = await bcrypt.hash(
          //   uname,
          //   parseInt(process.env.SALT)
          // );
          // setting cookies
          // const userCookie = await jwt.sign(hashed_token, process.env.JWT_KEY);
          // const trCookie = await jwt.sign(isExist._id, process.env.JWT_KEY);
          const token = isExist.token;
          setCookies("user", token, {
            req,
            res,
            maxAge: 60 * 60 * 24,
            sameSite: true,
            httpOnly: true,
            secure: true,
          });

          res.status(200).json({ message: "User Authenticated" });
        }
        break;
      case "POST":
        {
          // user registration
          const { email, username, name, phone, password, referral } =
            await req.body;
          // #check existing user
          const isExist = await User.findOne({
            email: email.toLowerCase(),
            username: username.toLowerCase(),
          });
          if (isExist) {
            return res
              .status(200)
              .json({ message: "Existing User! try to login." });
          }
          // encrypting user data for cookie
          const uname = username + Date.now();
          const hashed_token = await bcrypt.hash(
            uname,
            parseInt(process.env.SALT)
          );

          const userData = await new User({
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            name,
            phone,
            password,
            referral,
            token: hashed_token.toString(),
          });

          const kycData = new KYC({
            token: hashed_token.toString(),
          });

          const response1 = await kycData.save();
          const response2 = await userData.save();

          // setting cookies
          // const jwtCookie = await jwt.sign(hashed_token, process.env.JWT_KEY);
          setCookies("user", response2.token, {
            req,
            res,
            maxAge: 60 * 60 * 24,
            sameSite: true,
            httpOnly: true,
            secure: true,
          });
          res.status(201).json(response2.username);
        }
        break;
      case "UPDATE":
        {
        }
        break;
      default:
        {
          res.json({ message: "Request Method not defined!" });
        }
        break;
    }
  } catch (error) {
    res.send({ message: error.message });
  }
}
