import cryptoJs from "crypto-js";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "POST": {
        const event = req.body;
        //validate event
        const hash = cryptoJs
          .createHmac("sha512", secret)
          .update(JSON.stringify(req.body))
          .digest("hex");
        if (hash == req.headers["x-paystack-signature"]) {
          // Retrieve the request's body
          const event = req.body;
          // Do something with event
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
