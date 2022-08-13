import Link from "next/link";
import { useState, useEffect } from "react";
import RealTimeWidget from "../components/RealTimeWidget";
import CurrencyInput from "react-currency-input-field";
import axios from "axios";

import { usePaystackPayment } from "react-paystack";
let bank; //user bank details

function Buy() {
  const [percentage, setPercentage] = useState(0);
  const [trade, setTrade] = useState(true);
  const [prices, setPrices] = useState({
    gold: 0,
    ukoil: 0,
    usd: 0,
  });
  // const [bank, setBank] = useState({});

  useEffect(() => {
    async function fetchPrices() {
      const urlGold = `/api/Price/gold`;
      const urlUkoil = `/api/Price/ukoil`;
      const urlUsd = `/api/Price/usd`;

      const response1 = await axios(urlGold, { method: "GET" });
      const response2 = await axios(urlUkoil, { method: "GET" });
      const response3 = await axios(urlUsd, { method: "GET" });
      const response4 = await axios("/api/percentage/metalcharts");
      const bankResponse = await axios.get("/api/User/bank");

      const gold = await response1.data;
      const ukoil = await response2.data;
      const usd = await response3.data;

      console.log("bankResponse: ", bankResponse);
      console.log("gold", gold);
      console.log("ukoil", ukoil);
      console.log("usd", usd);
      console.log("bankResponse", bankResponse);

      setPrices({
        gold: gold.price,
        ukoil: ukoil.price,
        usd: usd.price,
      });

      setPercentage(response4.data.percentage);
      // setBank(bankResponse.data);
      bank = bankResponse.data;
    }
    fetchPrices();
  }, []);

  const changeTrade = (e) => {
    console.log(e.target.id);
    e.target.id === "GOLD" ? setTrade(true) : setTrade(false);
  };

  return (
    <section className="min-h-screen bg-[#131722]">
      <div className="mycontainer">
        <h1 className="text-center text-2xl font-extrabold text-white md:text-3xl lg:text-5xl">
          Buy From MetalCharts
        </h1>
        <div className="mt-2">
          {trade ? (
            <Gold
              changeTrade={changeTrade}
              val={trade}
              price={prices.gold}
              usd={prices.usd}
              percentage={percentage}
              bank={bank}
            />
          ) : (
            <Ukoil
              changeTrade={changeTrade}
              val={trade}
              price={prices.ukoil}
              usd={prices.usd}
              percentage={percentage}
              bank={bank}
            />
          )}
        </div>

        <div className="text-center font-light text-white">
          <p>
            Looking to Sell?{" "}
            <Link href="/user/Sell">
              <a className="font-medium underline hover:no-underline">
                Sell Now
              </a>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function Gold({ changeTrade, val, price, usd, percentage, bank }) {
  const [ounce, setOunce] = useState(0);

  return (
    <div className="my-8 flex flex-col overflow-hidden rounded-md border border-gray-700 lg:flex-row">
      <div className="h-auto w-full overflow-y-scroll border-slate-700 pb-4 md:h-[400px] lg:h-[500px] lg:w-1/3 lg:border-r lg:pb-0">
        <div className="bg-primary flex items-center justify-between p-2">
          <h4 className="hidden text-white lg:inline-block">
            Select Commodity:
          </h4>
          <div className="flex justify-between overflow-hidden rounded-full border border-white text-white">
            <button
              id="GOLD"
              onClick={changeTrade}
              className={`${val ? "bg-white text-blue-900" : ""} py-2 px-4`}
            >
              GOLD
            </button>
            <button
              id="UKOIL"
              onClick={changeTrade}
              className={`${val ? "" : "bg-white text-blue-900"} py-2 px-4`}
            >
              UKOIL
            </button>
          </div>
        </div>

        <div className="bg-slate-800 p-2 text-white">
          Rate: 1 Ounce = ${price}
        </div>

        {val ? (
          <BuyGold
            price={price}
            usd={usd}
            percentage={percentage}
            bank={bank}
          />
        ) : (
          <BuyUkoil percentage={percentage} bank={bank} />
        )}
      </div>
      <div className="h-[300px] w-full md:h-[400px] lg:h-[500px] lg:w-2/3">
        <RealTimeWidget type="GOLD" />
      </div>
    </div>
  );
}

function Ukoil({ changeTrade, val, price, usd, percentage, bank }) {
  const [barrel, setBarrel] = useState(0);

  console.log(price);

  return (
    <div className="my-8 flex flex-col overflow-hidden rounded-md border border-gray-700 lg:flex-row">
      <div className="h-auto w-full overflow-y-scroll border-slate-700 pb-4 md:h-[400px] lg:h-[500px] lg:w-1/3 lg:border-r lg:pb-0">
        <div className="bg-primary flex items-center justify-between p-2">
          <h4 className="hidden text-white lg:inline-block">
            Select Commodity:
          </h4>
          <div className="flex justify-between overflow-hidden rounded-full border border-white text-white">
            <button
              id="GOLD"
              onClick={changeTrade}
              className={`${val ? "bg-white text-blue-900" : ""} py-2 px-4`}
            >
              GOLD
            </button>
            <button
              id="UKOIL"
              onClick={changeTrade}
              className={`${val ? "" : "bg-white text-blue-900"} py-2 px-4`}
            >
              UKOIL
            </button>
          </div>
        </div>
        <div className="bg-slate-800 p-2 text-white">
          Rate: 1 Barrel = ${price}
        </div>

        {val ? (
          <BuyGold percentage={percentage} bank={bank} />
        ) : (
          <BuyUkoil
            price={price}
            usd={usd}
            percentage={percentage}
            bank={bank}
          />
        )}
      </div>

      <div className="h-[300px] w-full md:h-[400px] lg:h-[500px] lg:w-2/3">
        <RealTimeWidget type="UKOIL" />
      </div>
    </div>
  );
}

function BuyGold({ price, usd, percentage }) {
  const [error, setError] = useState({
    amount: "",
    qty: "",
    type: "",
    queue: "",
    response: "",
  });
  const [data, setData] = useState({
    amount: 0,
    qty: 0,
    type: "",
  });

  // initalizing paystack payment
  const config = {
    publicKey: "pk_test_25f1390fdb194da4c07d224401eb1e748fff82b1",
    amount: (parseFloat(data.amount) * parseFloat(usd) * 100).toFixed(2),
    email: bank?.email,
    currency: "NGN",
  };
  const initializePayment = usePaystackPayment(config);
  const onClose = () => {
    alert("Transaction was not completed, window closed.");
  };
  const onSuccess = async (success) => {
    const payData = {
      amount: data.amount,
      qty: data.qty,
      commodity: "gold",
      payment: success.reference,
    };
    console.log("payData:- ", payData);

    const response = await axios.post("/api/Trade/metalcharts/buy", payData);

    if (response.status == 201) {
      setError((prev) => {
        return { ...prev, queue: "Order Has been Placed, wait for approval." };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.amount < 5) {
      setError((prev) => {
        return { ...prev, amount: "Enter Valid Amount!" };
      });
    } else if (data.qty < 0) {
      setError((prev) => {
        return { ...prev, qty: "Enter Valid Quantity!" };
      });
    } else {
      // creating reciept for charge
      // const bankRes = await axios.get("/api/User/bank");
      // console.log("recieptRes", bankRes);
      if (bank.email) {
        initializePayment(onSuccess, onClose);

        setError({
          amount: "",
          qty: "",
          type: "",
          queue: "Wait! Placing Your Order...",
        });
      } else {
        setError((prev) => {
          return {
            ...prev,
            response:
              "You cant buy right now, firstly goto Dashboard -> Profile -> Bank and complete your bank account details",
          };
        });
      }
    }
  };

  const amountChange = (e) => {
    // console.log(e)
    if (e < 5) {
      setError((prev) => {
        return { ...prev, amount: "Amount Must be Morethan $5" };
      });

      setData((prev) => {
        return { ...prev, amount: e };
      });
    } else {
      let finalAmount = e - (e * percentage) / 100;
      let ounce = finalAmount / price;

      setError("");
      setData((prev) => {
        return { ...prev, amount: e, qty: ounce };
      });
    }
  };

  const qtyChange = (e) => {
    let minTarget = 5 / price;
    let qty = e.target.value;
    if (qty < minTarget) {
      setError((prev) => {
        return { ...prev, qty: `Amount Must be Morethan ${minTarget} Ounce` };
      });
      setData((prev) => {
        return { ...prev, qty };
      });
    } else {
      let amo = qty * price;
      console.log("amo", amo);
      setError("");
      setData((prev) => {
        return { ...prev, qty, amount: amo };
      });
    }
  };

  return (
    <div className="flex flex-col px-2">
      <form>
        <div className="input_group">
          <label htmlFor="amount" className="text-white">
            Enter Amount:
          </label>
          <CurrencyInput
            name="amount"
            id="amount"
            placeholder="Amount in USD"
            decimalsLimit={2}
            prefix="$"
            onValueChange={amountChange}
            value={data.amount}
          />
          {error.amount ? <span className="error">{error.amount}</span> : ""}
        </div>

        <div className="input_group">
          <label htmlFor="qty" className="text-white">
            Enter Quantity:
          </label>
          <input
            type="number"
            name="qty"
            id="qty"
            placeholder="Quantity in Ounce"
            onChange={qtyChange}
            value={data.qty}
          />
          {error.qty ? <span className="error">{error.qty}</span> : ""}
        </div>

        {error.response ? (
          <div className="text-red-400">
            <p>{error.response}</p>
          </div>
        ) : (
          ""
        )}

        <div className="group relative mb-24">
          <button
            onClick={handleSubmit}
            name="request"
            type="submit"
            id="1"
            className="btn-primary m-0 mt-4 w-full cursor-pointer px-4"
          >
            Send Request
          </button>

          <div>
            {error.queue ? (
              <span className="text-blue-500">{error.queue}</span>
            ) : (
              ""
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

function BuyUkoil({ price, usd, bank }) {
  const [error, setError] = useState({
    amount: "",
    qty: "",
    type: "",
    queue: "",
    response: "",
  });
  const [data, setData] = useState({
    amount: 0,
    qty: 0,
    type: "",
  });

  // initalizing paystack payment
  const config = {
    publicKey: "pk_test_25f1390fdb194da4c07d224401eb1e748fff82b1",
    amount: (parseFloat(data.amount) * parseFloat(usd) * 100).toFixed(2),
    email: bank?.email,
    currency: "NGN",
  };
  const initializePayment = usePaystackPayment(config);
  const onClose = () => {
    alert("Transaction was not completed, window closed.");
  };
  const onSuccess = async (success) => {
    const payData = {
      amount: data.amount,
      qty: data.qty,
      commodity: "ukoil",
      payment: success.reference,
    };
    console.log("payData:- ", payData);

    const response = await axios.post("/api/Trade/metalcharts/buy", payData);

    if (response.status == 201) {
      setData({
        amount: 0,
        qty: 0,
        type: "",
      });
      setError((prev) => {
        return { ...prev, queue: "Order Has been Placed, wait for approval." };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(e);

    if (data.amount < 5) {
      setError((prev) => {
        return { ...prev, amount: "Enter Valid Amount!" };
      });
    } else if (data.qty < 0) {
      setError((prev) => {
        return { ...prev, qty: "Enter Valid Quantity!" };
      });
    } else {
      // creating reciept for charge
      // const bankRes = await axios.get("/api/User/bank");
      // console.log("recieptRes", bankRes);
      if (bank.email) {
        initializePayment(onSuccess, onClose);
        setError({
          amount: "",
          qty: "",
          type: "",
          queue: "Wait! Placing Your Order...",
        });
      } else {
        setError((prev) => {
          return {
            ...prev,
            response:
              "You cant buy right now, firstly goto Dashboard -> Profile -> Bank and complete your bank account details",
          };
        });
      }
    }
  };

  const amountChange = (e) => {
    // console.log(e)
    if (e < 5) {
      setError((prev) => {
        return { ...prev, amount: "Amount Must be Morethan $5" };
      });

      setData((prev) => {
        return { ...prev, amount: e };
      });
    } else {
      let barr = e / price;

      setError("");
      setData((prev) => {
        return { ...prev, amount: e, qty: barr };
      });
    }
  };

  const qtyChange = (e) => {
    let minTarget = 5 / price;
    let qty = e.target.value;
    if (qty < minTarget) {
      setError((prev) => {
        return { ...prev, qty: `Amount Must be Morethan ${minTarget} Barrel` };
      });
      setData((prev) => {
        return { ...prev, qty };
      });
    } else {
      let amo = qty * price;
      console.log(amo);
      setError("");
      setData((prev) => {
        return { ...prev, qty, amount: amo };
      });
    }
  };

  return (
    <div className="flex flex-col px-2">
      <form onSubmit={handleSubmit}>
        <div className="input_group">
          <label htmlFor="amount" className="text-white">
            Enter Amount:
          </label>
          <CurrencyInput
            name="amount"
            id="amount"
            placeholder="Amount in USD"
            decimalsLimit={2}
            prefix="$"
            onValueChange={amountChange}
            value={data.amount}
          />
          {error.amount ? <span className="error">{error.amount}</span> : ""}
        </div>

        <div className="input_group">
          <label htmlFor="qty" className="text-white">
            Enter Quantity:
          </label>
          <input
            type="number"
            name="qty"
            id="qty"
            placeholder="Quantity in Barrel"
            onChange={qtyChange}
            value={data.qty}
          />
          {error.qty ? <span className="error">{error.qty}</span> : ""}
        </div>

        {error.response ? (
          <div className="text-red-400">
            <p>{error.response}</p>
          </div>
        ) : (
          ""
        )}

        <div className="group relative mb-24">
          <button
            onClick={handleSubmit}
            name="request"
            type="submit"
            id="1"
            className="btn-primary m-0 mt-4 w-full cursor-pointer px-4"
          >
            Send Request
          </button>

          <div>
            {error.queue ? (
              <span className="text-blue-500">{error.queue}</span>
            ) : (
              ""
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Buy;
