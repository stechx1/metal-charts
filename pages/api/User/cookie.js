import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCookie, setCookies } from "cookies-next";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET":
        {
          const user = await getCookie("user", { req, res });
          console.log(user);

          res.send(user);
        }
        break;
      case "POST": {
        setCookies("user", "", {
          req,
          res,
          expires: new Date(0),
          sameSite: true,
          httpOnly: true,
          secure: true,
        });

        res.status(204);
      }
      default:
        {
          res.json({ message: "Request Method not defined!" });
        }
        break;
    }
  } catch (error) {
    res.json({ message: error.message });
  }
}
