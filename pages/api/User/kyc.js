import { getCookie } from "cookies-next";
import database from "../../../lib/database";
import multer from "multer";
import nc from "next-connect";
import path from "path";
import User from "../../../models/User";
import fs from "fs";
import KYC from "../../../models/KYC";
import getConfig from "next/config";

export const config = {
  api: {
    bodyParser: false,
  },
};
const handler = nc();

async function db() {
  //database
  await database();
}

// multer
let index = 0;
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    db();
    const token = getCookie("user", { req });
    const user = await User.findOne({ token });
    const username = await user.username;
    // const address = `/uploads/users/${username}/kyc`;
    const address = path.join(
      getConfig().serverRuntimeConfig.PROJECT_ROOT,
      `/public/uploads/users/${username}/kyc`
    );
    if (!fs.existsSync(address)) {
      fs.mkdirSync(address, { recursive: true });
    }
    cb(null, address);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    index = index = 1;
  },
});
let upload = multer({
  storage: storage,
});
const files = upload.array("kyc", 3);

// middleware
handler.use(files);

handler.post(async (req, res) => {
  try {
    //database
    await database();
    const token = getCookie("user", { req, res });
    const { address, city, country, dob, selfie } = await req.body;

    const kyc = await KYC.findOneAndUpdate(
      { token: token },
      {
        address,
        city,
        country,
        dob,
      },
      { new: true, upsert: true }
    );

    // udpate user application status
    const user = await User.findOneAndUpdate(
      { token: token },
      { status: "waiting" },
      { new: true }
    );

    res.status(201).send(user.status);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// checking kyc status
handler.get(async (req, res) => {
  try {
    //database
    await database();

    const token = getCookie("user", { req, res });
    const user = await User.findOne({ token });
    res.status(200).send(user.status);
  } catch (error) {
    res.status(204).json({ message: error.message });
  }
});

// allowing to resubmit application
handler.patch(async (req, res) => {
  try {
    //database
    await database();

    const token = getCookie("user", { req, res });
    const user = await User.findOneAndUpdate(
      { token: token },
      { status: "resubmition" },
      { new: true, upsert: true }
    );
    res.status(200).send(user.status);
  } catch (error) {
    res.status(204).json({ message: error.message });
  }
});

export default handler;
