import { getCookie } from "cookies-next";
import database from "../../../lib/database.js";
import User from "../../../models/User.js";

export default async function handler(req, res) {
  try {
    // database
    await database();

    switch (req.method) {
      case "GET": {
        const token = getCookie("user", { req, res });
        const user = await User.aggregate([
          {
            $match: {
              token,
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              refCode: 1,
              referalFriends: 1,
              earned: 1,
              token: 1,
              username: 1,
              refferal: 1,
              phone: 1,
            },
          },
        ]);

        return res.send(user[0]);
      }
      case "POST": {
        // updating name
        const { name } = await req.query;
        // console.log(name)
        const token = getCookie("user", { req, res });
        const user = await User.findOneAndUpdate(
          { token: token },
          { name: name },
          { new: true }
        );

        return res.status(201).send(user);
      }
      case "PATCH": {
        // updating password
        const { oldPass, newPass } = await req.body;
        const token = getCookie("user", { req, res });
        // need to update it to hashed password
        const checkOldPass = await User.findOne({ token });
        if (checkOldPass.password && checkOldPass.password == oldPass) {
          const user = await User.findOneAndUpdate(
            { token: token },
            { password: newPass },
            { new: true }
          );
          return res.status(201).send(user);
        } else {
          return res
            .status(200)
            .json({ message: "Old Password is not Correct" });
        }
      }
      default: {
        return res.json({ message: "Request Method not defined!" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
