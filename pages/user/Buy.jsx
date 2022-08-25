import Link from "next/link";
import { useState, useEffect } from "react";
import RealTimeWidget from "../components/RealTimeWidget";
import CurrencyInput from "react-currency-input-field";
import axios from "axios";
import { useRouter } from "next/router";

import { usePaystackPayment } from "react-paystack";
import { useLocalStorage } from "../../hooks/useLocalStorage";

let bank; //user bank details
let usd; // exchange rate

function Buy() {
  const [trade, setTrade] = useState(true);
  const [prices, setPrices] = useState({
    gold: 0,
    ukoil: 0,
  });

  const changeTrade = (e) => {
    console.log(e.target.id);
    e.target.id === "GOLD" ? setTrade(true) : setTrade(false);
  };

  useEffect(() => {
    (async () => {
      const goldResponse = await axios.get("/api/Price/gold");
      const ukoilResponse = await axios.get("/api/Price/ukoil");
      const usdResponse = await axios.get("/api/Price/usd");
      const bankResponse = await axios.get("/api/User/bank");

      const gold = await goldResponse.data;
      const ukoil = await ukoilResponse.data;
      setPrices({
        gold: gold.price,
        ukoil: ukoil.price,
      });

      bank = bankResponse.data;
      usd = usdResponse.data.price;
    })();
  }, []);

  return (
    <section className="min-h-screen bg-[#131722]">
      <div className="mycontainer">
        <h1 className="text-center text-2xl font-extrabold text-white md:text-3xl lg:text-5xl">
          Buy Now
        </h1>
        <div className="mt-2">
          {trade ? (
            <Gold changeTrade={changeTrade} val={trade} price={prices.gold} />
          ) : (
            <UKOIL changeTrade={changeTrade} val={trade} price={prices.ukoil} />
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

function Gold({ changeTrade, val, price }) {
  return (
    <div className="my-8 flex flex-col overflow-hidden rounded-md border border-gray-700 lg:flex-row">
      <div className="h-[300px] w-full overflow-y-scroll border-slate-700 md:h-[400px] lg:h-[500px] lg:w-1/3 lg:border-r">
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

        {val ? <BuyGold /> : <BuyUKOIL />}
      </div>
      <div className="h-[300px] w-full md:h-[400px] lg:h-[500px] lg:w-2/3">
        <RealTimeWidget type="GOLD" />
      </div>
    </div>
  );
}

function UKOIL({ changeTrade, val, price }) {
  return (
    <div className="my-8 flex flex-col overflow-hidden rounded-md border border-gray-700 lg:flex-row">
      <div className="h-[300px] w-full overflow-y-scroll border-slate-700 md:h-[400px] lg:h-[500px] lg:w-1/3 lg:border-r">
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

        {val ? <BuyGold /> : <BuyUKOIL />}
      </div>
      <div className="h-[300px] w-full md:h-[400px] lg:h-[500px] lg:w-2/3">
        <RealTimeWidget type="UKOIL" />
      </div>
    </div>
  );
}

function BuyGold() {
  const [error, setError] = useState("");
  const [data, setData] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const changeHandler = (e) => {
    // console.log(e)
    if (e < 5) {
      setError("Amount Must be Morethan $5");
    } else if (e > 20000) {
      setError("Amount Must be Lessthan 20000$");
    } else {
      setError("");
      fetchData(e);
    }
  };

  const fetchData = async (value) => {
    const response = await axios.get("/api/Trade/Sell", {
      params: { amount: value, commodity: "gold" },
    });

    setData(response.data);
    console.log(response.data);
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit}>
        <div className="flex w-full overflow-hidden">
          <div className="hidden bg-slate-800 py-2 pl-2 pr-4 text-white lg:inline-block">
            Amount:
          </div>

          <CurrencyInput
            className="w-full bg-slate-700 p-2 text-white outline-none"
            name="amount"
            id="amount"
            placeholder="Enter Amount $5"
            decimalsLimit={2}
            prefix="$"
            onValueChange={changeHandler}
          />
        </div>

        {error ? <span className="error">{error}</span> : ""}
      </form>

      <div className="flex flex-col">
        {data.length > 0 ? (
          data.map((item, id) => {
            return (
              <>
                {item.trade
                  ? item.trade.map((row, id) => {
                      return (
                        <>
                          <BuyGoldCard
                            name={item.username}
                            data={row}
                            key={id}
                          />
                        </>
                      );
                    })
                  : ""}
              </>
            );
          })
        ) : (
          <p className="mt-4 text-center text-yellow-500">
            Enter Amount to Search
          </p>
        )}
      </div>
    </div>
  );
}

function BuyGoldCard({ name, data }) {
  const [recieverToken, setRecieverToken] = useLocalStorage(
    "recieverToken",
    ""
  );
  const [sellingCommodityDetails, setsellingCommodityDetails] = useLocalStorage(
    "sellingCommodityDetails",
    ""
  );
  const [user, setUser] = useLocalStorage("user", {});

  const router = useRouter();
  // initalizing paystack payment
  const config = {
    publicKey: "pk_test_25f1390fdb194da4c07d224401eb1e748fff82b1",
    amount: (parseFloat(data.amount) * parseFloat(usd) * 100).toFixed(2),
    email: bank?.email,
    currency: "NGN",
  };

  // console.log("config", config);
  // console.log("bank", bank);
  // console.log("usd", usd);

  const initializePayment = usePaystackPayment(config);

  const qty = parseFloat(data.qty);

  const placeOrder = async (data) => {
    const newOrder = {
      sellerId: data._id,
      buyerId: user._id,
      amount: data.amount,
      qty: data.qty,
      commodity: data.commodity,
      duration: data.duration,
    };
    try {
      const res = await axios.post("/api/order/create", newOrder);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // initiate payment popup
  const buynow = async () => {
    if (bank.email) {
      console.log("Data from buy now", data);
      // initializePayment(onSuccess, onClose);
      setRecieverToken(data.seller);
      setsellingCommodityDetails(data);
      placeOrder(data);
      router.push("/user/buy-from-seller");
    } else {
      alert(
        "You cant buy right now, firstly goto Dashboard -> Profile -> Bank and complete your bank account details"
      );
    }
  };

  const onClose = () => {
    alert("Transaction was not completed, window closed.");
  };

  const onSuccess = async (success) => {
    const payData = {
      _id: data._id,
      trx_id: success.reference,
    };
    console.log("payData:- ", payData);

    const response = await axios.put("/api/Trade/Sell", payData);
    console.log("response:- ", response);

    if (response.status == 201) {
      alert("Order Has been Placed, wait for approval.");
    }
  };

  return (
    <div
      className="my-1 flex w-full items-center justify-between overflow-hidden rounded-md bg-slate-800
				p-2 text-white shadow-md shadow-slate-900"
    >
      <div className="w-full">
        <h4 className="text-base font-medium">Gold: {qty.toFixed(5)} Ounce</h4>
        <h4 className="text-base font-medium">
          Amount: ${parseFloat(data.amount)}
        </h4>
        <h5 className="flex items-center text-sm font-light">
          <div className="mr-2">Seller: {name}</div>
        </h5>
      </div>
      <button className="btn-green text-xs" onClick={buynow}>
        Buy Now
      </button>
    </div>
  );
}

function BuyUKOIL() {
  const [error, setError] = useState("");
  const [data, setData] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const changeHandler = (e) => {
    // console.log(e)
    if (e < 5) {
      setError("Amount Must be More than $5");
    } else if (e > 20000) {
      setError("Amount Must be Less than 20000$");
    } else {
      setError("");
      fetchData(e);
    }
  };

  const fetchData = async (value) => {
    const response = await axios.get("/api/Trade/Sell", {
      params: { amount: value, commodity: "ukoil" },
    });

    setData(response.data);
    console.log(response.data);
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit}>
        <div className="flex w-full overflow-hidden">
          <div className="hidden bg-slate-800 py-2 pl-2 pr-4 text-white lg:inline-block">
            Amount:
          </div>

          <CurrencyInput
            className="w-full bg-slate-700 p-2 text-white outline-none"
            name="amount"
            id="amount"
            placeholder="Enter Amount $5"
            decimalsLimit={2}
            prefix="$"
            onValueChange={changeHandler}
          />
        </div>

        {error ? <span className="error">{error}</span> : ""}
      </form>

      <div className="flex flex-col">
        {data.length > 0 ? (
          data.map((item, id) => {
            return (
              <>
                {item.trade
                  ? item.trade.map((row, id) => {
                      return (
                        <>
                          <BuyUkoilCard
                            usd={usd}
                            bank={bank}
                            name={item.username}
                            data={row}
                            key={id}
                          />
                          fenter
                        </>
                      );
                    })
                  : ""}
              </>
            );
          })
        ) : (
          <p className="mt-4 text-center text-yellow-500">
            Enter Amount to Search
          </p>
        )}
      </div>
    </div>
  );
}

function BuyUkoilCard({ name, data }) {
  const [recieverToken, setRecieverToken] = useLocalStorage(
    "recieverToken",
    ""
  );
  const [sellingCommodityDetails, setsellingCommodityDetails] = useLocalStorage(
    "sellingCommodityDetails",
    ""
  );
  const [user, setUser] = useLocalStorage("user", {});
  const router = useRouter();

  const placeOrder = async (data) => {
    const newOrder = {
      sellerId: data._id,
      buyerId: user._id,
      amount: data.amount,
      qty: data.qty,
      commodity: data.commodity,
      duration: data.duration,
    };
    try {
      const res = await axios.post("/api/order/create", newOrder);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  // initalizing paystack payment
  const config = {
    publicKey: "pk_test_25f1390fdb194da4c07d224401eb1e748fff82b1",
    amount: (parseFloat(data.amount) * parseFloat(usd) * 100).toFixed(2),
    email: bank?.email,
    currency: "NGN",
  };

  // console.log("bank", bank);
  // console.log("usd", usd);

  const initializePayment = usePaystackPayment(config);

  const qty = parseFloat(data.qty);
  // initiate payment popup
  const buynow = async () => {
    if (bank.email) {
      console.log("Data from buy now", data);
      // initializePayment(onSuccess, onClose);
      setRecieverToken(data.seller);
      setsellingCommodityDetails(data);
      placeOrder(data);
      router.push("/user/buy-from-seller");
    } else {
      alert(
        "You cant buy right now, firstly goto Dashboard -> Profile -> Bank and complete your bank account details"
      );
    }
  };

  const onClose = () => {
    alert("Transaction was not completed, window closed.");
  };

  const onSuccess = async (success) => {
    const payData = {
      _id: data._id,
      trx_id: success.reference,
    };
    console.log("payData:- ", payData);

    const response = await axios.put("/api/Trade/Sell", payData);
    console.log("response:- ", response);

    if (response.status == 201) {
      alert("Order Has been Placed, wait for approval.");
    }
  };

  return (
    <div
      className="my-1 flex w-full items-center justify-between overflow-hidden rounded-md bg-slate-800
				p-2 text-white shadow-md shadow-slate-900"
    >
      <div className="w-full">
        <h4 className="text-base font-medium">
          Ukoil: {qty.toFixed(5)} Barrel
        </h4>
        <h4 className="text-base font-medium">
          Amount: ${parseFloat(data.amount)}
        </h4>
        <h5 className="flex items-center text-sm font-light">
          <div className="mr-2">Seller: {name}</div>
        </h5>
      </div>
      <button className="btn-green text-xs" onClick={buynow}>
        Buy Now
      </button>
    </div>
  );
}

export default Buy;
