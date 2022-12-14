import { useState } from "react";
import axios from "axios";
import Buyp2p from "../../../models/Buyp2p";
import SellPercentage from "../../../models/SellPercentage";
import { useRouter } from "next/router";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

const ViewRequest = ({ data, banks }) => {
  const router = useRouter();
  const [recieverToken, setRecieverToken] = useLocalStorage(
    "recieverToken",
    ""
  );
  const [trade, setTrade] = useState(JSON.parse(data)[0]);
  const [uBanks, setUBanks] = useState(JSON.parse(banks));

  console.log(trade);

  console.log({ data, uBanks });

  const approve = async () => {
    const response = await axios.put("/api/Trade/admin/Sell", {
      _id: trade._id,
      orderid: trade.orderid,
      status: "accepted",
    });
    console.log(response);
    if (response.status == 201) {
      setTrade((prev) => {
        return { ...prev, status: response.data.buyData.status };
      });
    }
  };

  // const reject = async () => {
  //   const response = await axios.put("/api/Trade/admin/Sell", {
  //     _id: trade._id,
  //     orderid: trade.orderid,
  //     status: "rejected",
  //   });
  //   console.log(response);
  //   if (response.status == 201) {
  //     setTrade((prev) => {
  //       return { ...prev, status: response.data.buyData.status };
  //     });
  //   }
  // };

  return (
    <div className="w-[1200px] mx-auto h-screen overflow-y-scroll py-6 px-4">
      <h1 className="text-3xl font-bold border-b border-[#131722] pb-6">
        View Request
      </h1>

      <div className="">
        <div className="flex flex-col mt-4">
          <h4 className="text-xl font-semibold ">Trade Detdails:</h4>
          <div className="flex">
            <div className="my-2 w-1/2 flex flex-col">
              <b>Amount:</b>{" "}
              <span className="uppercase bg-gray-200 p-2 rounded-md">
                ${trade.amount}
              </span>
            </div>
            <div className="my-2 w-1/2 flex flex-col ml-2">
              <b>Quantity:</b>{" "}
              <span className="uppercase bg-gray-200 p-2 rounded-md">
                {trade.qty}
              </span>
            </div>
          </div>

          <div className="flex">
            <div className="my-2 w-1/2 flex flex-col">
              <b>Commodity: </b>
              <span className="uppercase bg-gray-200 p-2 rounded-md">
                {trade.commodity}
              </span>
            </div>
            <div className="my-2 w-1/2 flex flex-col ml-2">
              <b>Status:</b>
              <span className="uppercase bg-gray-200 p-2 rounded-md">
                {trade.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-4">
          <h4 className="text-xl font-semibold">Buyer Details:</h4>

          <div className="flex">
            <div className="my-2 w-1/2 flex flex-col">
              <b>Account Holder Name: </b>
              <span className="uppercase bg-gray-200 p-2 rounded-md">
                {trade.b_b_name}
              </span>
            </div>
            <div className="my-2 w-1/2 flex flex-col ml-2">
              <b>Account Holder Email: </b>
              <span className="uppercase bg-gray-200 p-2 rounded-md">
                {trade.b_b_email}
              </span>
            </div>
          </div>

          <div className="flex">
            <div className="my-2 w-1/2 flex flex-col">
              <b>Transaction Id: </b>
              <span className="uppercase bg-gray-200 p-2 rounded-md">
                {trade.trx_id}
              </span>
            </div>
          </div>
        </div>

        <>
          <div className="flex mt-4">
            {trade.status == "pending" && (
              <button className="btn-primary px-6" onClick={approve}>
                I recieved the payment
              </button>
            )}
            <button
              className="btn-primary bg-red-500 hover:bg-red-600 px-6"
              onClick={() => router.push("/chat")}
            >
              Chat with the buyer
            </button>
          </div>
        </>
      </div>
    </div>
  );
};

export default ViewRequest;

export async function getServerSideProps(context) {
  const params = context.params;
  const id = params.id;
  console.log(id);

  const response = await Buyp2p.aggregate([
    {
      $match: {
        $expr: {
          $eq: ["$_id", { $toObjectId: id }],
        },
      },
    },
    // getting seller details
    {
      $lookup: {
        from: "users",
        localField: "seller",
        foreignField: "token",
        as: "selUser",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$selUser", 0] }, "$$ROOT"],
        },
      },
    },
    { $project: { selUser: 0 } },
    {
      $project: {
        seller: "$username",
        buyer: 1,
        token: 1,
        trx_id: 1,
        orderid: 1,
        created_at: 1,
      },
    },
    // getting seller bank account
    {
      $lookup: {
        from: "banks",
        localField: "token",
        foreignField: "token",
        as: "sellBank",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$sellBank", 0] }, "$$ROOT"],
        },
      },
    },
    { $project: { sellBank: 0 } },

    {
      $project: {
        seller: 1,
        buyer: 1,
        trx_id: 1,
        orderid: 1,
        created_at: 1,

        s_b_name: "$name",
        s_b_account: "$account",
        s_b_email: "$email",
        s_b_bankid: "$bankid",
      },
    },
    // getting buyer details
    {
      $lookup: {
        from: "users",
        localField: "buyer",
        foreignField: "token",
        as: "buyUser",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$buyUser", 0] }, "$$ROOT"],
        },
      },
    },
    { $project: { buyUser: 0 } },
    {
      $project: {
        buyer: "$username",
        token: 1,

        trx_id: 1,
        orderid: 1,
        s_b_name: 1,
        s_b_account: 1,
        s_b_email: 1,
        s_b_bankid: 1,
        seller: 1,
      },
    },

    // getting buyer bank account
    {
      $lookup: {
        from: "banks",
        localField: "token",
        foreignField: "token",
        as: "buyBank",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$buyBank", 0] }, "$$ROOT"],
        },
      },
    },
    { $project: { buyBank: 0 } },

    {
      $project: {
        seller: 1,
        buyer: 1,
        created_at: 1,
        trx_id: 1,
        orderid: 1,

        s_b_name: 1,
        s_b_account: 1,
        s_b_email: 1,
        s_b_bankid: 1,

        b_b_name: "$name",
        b_b_account: "$account",
        b_b_email: "$email",
        b_b_bankid: "$bankid",
      },
    },

    // getting trade info

    { $set: { orderid: { $toObjectId: "$orderid" } } },
    {
      $lookup: {
        from: "sells",
        localField: "orderid",
        foreignField: "_id",
        as: "trade",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$trade", 0] }, "$$ROOT"],
        },
      },
    },
    { $project: { trade: 0 } },
    {
      $project: {
        seller: 1,
        buyer: 1,
        created_at: 1,
        trx_id: 1,
        orderid: 1,

        s_b_name: 1,
        s_b_account: 1,
        s_b_email: 1,
        s_b_bankid: 1,

        b_b_name: 1,
        b_b_account: 1,
        b_b_email: 1,
        b_b_bankid: 1,

        amount: 1,
        qty: 1,
        status: 1,
        commodity: 1,
      },
    },
  ]);

  console.log("response:-", response);

  const bankResponse = await axios(`https://api.paystack.co/bank`, {
    headers: {
      Authorization: "Bearer" + process.env.SECRET_KEY,
    },
  });
  const banks = bankResponse.data.data;

  const sellerBank = banks.filter((item) => {
    return item.id == response[0].s_b_bankid;
  });
  const buyerBank = banks.filter((item) => {
    return item.id == response[0].b_b_bankid;
  });
  console.log("banks", { sellerBank, buyerBank });

  // commodity selling percentage
  const percentageResponse = await SellPercentage.findOne({
    commodity: "p2p",
  });

  return {
    props: {
      // percentage: percentageResponse.percentage,
      data: JSON.stringify(response),
      banks: JSON.stringify({
        seller: sellerBank[0].name,
        buyer: buyerBank[0].name,
      }),
    },
  };
}
