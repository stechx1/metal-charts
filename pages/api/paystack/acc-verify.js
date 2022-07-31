import axios from "axios";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "POST": {
        let { acc_no, bank_code } = req.body; //TODO: change it to body

        console.log("req.query", req.body);

        const response = await axios(
          `https://api.paystack.co/bank/resolve?account_number=${acc_no}&bank_code=${bank_code}`,
          {
            headers: {
              Authorization: "Bearer " + process.env.SECRET_KEY,
            },
          }
        );

        res.removeHeader("x-powered-by");
        res.removeHeader("set-cookie");
        res.removeHeader("Date");
        res.removeHeader("Connection");

        return res.send(response.data.data);
      }
      default: {
        return res.json({ message: "Request Method not defined!" });
      }
    }
  } catch (error) {
    res.json({ "acc-verify": error.message });
  }
}
