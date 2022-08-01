import Link from "next/link";
import { useState, useEffect } from "react";
import RealTimeWidget from "../components/RealTimeWidget";
import CurrencyInput from "react-currency-input-field";
import Popup from "reactjs-popup";
import axios from "axios";

let bank; //user bank details

function Sell() {
  const [balance, setBalance] = useState({
    gold: 0,
    ukoil: 0,
  });
  const [percentage, setPercentage] = useState({
    p2p: 0,
    metalcharts: 0,
  });
  const [trade, setTrade] = useState(true);

  const [prices, setPrices] = useState({
    gold: 0,
    ukoil: 0,
  });

  useEffect(() => {
    async function fetchPrices() {
      const urlGold = `/api/Price/gold`;
      const urlUkoil = `/api/Price/ukoil`;

      const response1 = await axios(urlGold, { method: "GET" });
      const response2 = await axios(urlUkoil, { method: "GET" });

      const response3 = await axios("/api/percentage/metalcharts");
      const response4 = await axios("/api/percentage/p2p");

      const gold = await response1.data;
      const ukoil = await response2.data;

      //   personal balance
      const goldBal = await axios.get("/api/balance/gold");
      const ukoilBal = await axios.get("/api/balance/ukoil");
      const bankResponse = await axios.get("/api/User/bank");

      setBalance({
        gold: goldBal.data?.amount,
        ukoil: ukoil.data?.amount,
      });

      setPrices({
        gold: gold.price,
        ukoil: ukoil.price,
      });

      setPercentage({
        p2p: response4.data.percentage,
        metalcharts: response3.data.percentage,
      });

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
          Sell Now
        </h1>
        <div className="mt-2">
          {trade ? (
            <Gold
              changeTrade={changeTrade}
              val={trade}
              price={prices.gold}
              percentage={percentage}
            />
          ) : (
            <Ukoil
              changeTrade={changeTrade}
              val={trade}
              price={prices.ukoil}
              percentage={percentage}
            />
          )}
        </div>

        <div className="text-center font-light text-white">
          <p>
            Looking to Buy?{" "}
            <Link href="/user/Buy">
              <a className="font-medium underline hover:no-underline">
                Buy Now
              </a>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function Gold({ changeTrade, val, price, percentage }) {
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
          <SellGold price={price} percentage={percentage} />
        ) : (
          <SellUkoil percentage={percentage} />
        )}
      </div>
      <div className="h-[300px] w-full md:h-[400px] lg:h-[500px] lg:w-2/3">
        <RealTimeWidget type="GOLD" />
      </div>
    </div>
  );
}

function Ukoil({ changeTrade, val, price, percentage }) {
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
          <SellGold percentage={percentage} />
        ) : (
          <SellUkoil price={price} percentage={percentage} />
        )}
      </div>

      <div className="h-[300px] w-full md:h-[400px] lg:h-[500px] lg:w-2/3">
        <RealTimeWidget type="UKOIL" />
      </div>
    </div>
  );
}

function SellGold({ price, percentage }) {
  const [error, setError] = useState({
    amount: "",
    qty: "",
    type: "",
    duration: "",
    queue: "",
  });
  const [data, setData] = useState({
    amount: 0,
    qty: 0,
    type: "",
    duration: "",
    to: "peer2peer",
  });
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
    } else if (!data.duration || data.duration < 10) {
      setError((prev) => {
        return { ...prev, duration: "Enter Valid Duration!" };
      });
    } else {
      if (bank.email) {
        setError({
          amount: "",
          qty: "",
          type: "",
          duration: "",
          queue: "Wait! Placing Your Order...",
        });

        const balance = await axios.get("/api/balance/gold");

        if (balance.data.amount >= data.qty) {
          const result = await axios("/api/Trade/Sell", {
            method: "POST",
            data: {
              amount: data.amount,
              qty: data.qty.toString(),
              type: data.to,
              duration: data.duration,
              commodity: "gold",
            },
          });

          console.log(result);

          if (result.status == 201) {
            setError((prev) => {
              return {
                ...prev,
                queue: "You Order has been Placed.",
              };
            });
            setData({
              amount: 0,
              qty: 0,
              type: "SellGold",
              duration: "",
              to: "",
            });
          } else {
            setError((prev) => {
              return {
                ...prev,
                queue: result.data.message,
              };
            });
          }
        } else {
          setError({
            amount: "",
            qty: "",
            type: "",
            duration: "",
            queue: "Insufficient Balance",
          });
        }
      } else {
        setError({
          amount: "",
          qty: "",
          type: "",
          duration: "",
          queue:
            "You cant sell right now, firstly goto Dashboard -> Profile -> Bank and complete your bank account details",
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
      let ounce = e / price;

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
      console.log(amo);
      setError("");
      setData((prev) => {
        return { ...prev, qty, amount: amo };
      });
    }
  };

  // calculating percentage
  let pr;
  if (data.to === "peer2peer") {
    pr = percentage.p2p;
  } else {
    pr = percentage.metalcharts;
  }
  let finalValue = data.amount - (data.amount * pr) / 100;

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

        <div className="input_group">
          <label htmlFor="duration" className="text-white">
            Completion Time:
          </label>
          <input
            type="number"
            name="duration"
            id="duration"
            placeholder="Duration in Min"
            onChange={(e) => {
              setData((prev) => {
                return { ...prev, duration: e.target.value };
              });
            }}
            value={data.duration}
          />
          {error.duration ? (
            <span className="error">{error.duration}</span>
          ) : (
            ""
          )}
        </div>

        <div className="mt-4 flex flex-col">
          <label className="text-white">Selling to?</label>

          <div className="my-2 flex">
            <div className="mr-1 flex w-1/2">
              <input
                type="radio"
                name="type"
                id="p2p"
                value="peer2peer"
                onChange={(e) => {
                  setData((prev) => {
                    return { ...prev, to: e.target.value };
                  });
                }}
                className="peer sr-only"
                checked={data.to === "peer2peer"}
              />

              <label
                htmlFor="p2p"
                className="flex h-full w-full cursor-pointer flex-col rounded-lg border-2 border-gray-300 p-2 text-blue-800
                 hover:bg-gray-100 focus:outline-none peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-green-500"
              >
                <h2 className="text-center text-base font-semibold">
                  Peer 2 Peer
                </h2>
                <p className="text-center text-xs">
                  Transaction Fee: {percentage.p2p}%
                </p>
              </label>
            </div>

          </div>
        </div>

        {data.amount > 0 ? (
          <div className="text-white">
            <p>You will receive ${finalValue.toFixed(2)}</p>
          </div>
        ) : (
          ""
        )}

        <div className="relative mb-24">
          <button
            onClick={handleSubmit}
            name="request"
            type="submit"
            id="1"
            className="btn-primary m-0 mt-4 w-full cursor-pointer px-4"
          >
            Sell Now
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

function SellUkoil({ price, percentage }) {
  const [error, setError] = useState({
    amount: "",
    qty: "",
    type: "",
    duration: "",
    queue: "",
  });
  const [data, setData] = useState({
    amount: 0,
    qty: 0,
    type: "",
    duration: "",
    to: "peer2peer",
  });
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
    } else if (!data.duration || data.duration < 10) {
      setError((prev) => {
        return { ...prev, duration: "Enter Valid Duration!" };
      });
    } else {
      if (bank.email) {
        setError({
          amount: "",
          qty: "",
          type: "",
          duration: "",
          queue: "Wait! Placing Your Order...",
        });
        const balance = await axios.get("/api/balance/ukoil");
        if (balance.data.amount >= data.qty) {
          const result = await axios("/api/Trade/Sell", {
            method: "POST",
            data: {
              amount: data.amount,
              qty: data.qty.toString(),
              type: data.to,
              duration: data.duration,
              commodity: "ukoil",
            },
          });

          console.log(result);

          if (result.status == 201) {
            setError((prev) => {
              return {
                ...prev,
                queue: "Your Selling Order has been Placed.",
              };
            });
            setData({
              amount: 0,
              qty: 0,
              type: "SellUkoil",
              duration: "",
              to: "",
            });
          } else {
            setError((prev) => {
              return {
                ...prev,
                queue: result.data.message,
              };
            });
          }
        } else {
          setError({
            amount: "",
            qty: "",
            type: "",
            duration: "",
            queue: "Insufficient Balance",
          });
        }
      } else {
        setError({
          amount: "",
          qty: "",
          type: "",
          duration: "",
          queue:
            "You cant sell right now, firstly goto Dashboard -> Profile -> Bank and complete your bank account details",
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
    } else if (e > 20000) {
      setError((prev) => {
        return { ...prev, amount: "Amount Must be Lessthan $20k" };
      });

      setData((prev) => {
        return { ...prev, amount: 0 };
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
    } else if (qty > 215) {
      setError((prev) => {
        return { ...prev, qty: "Amount Must be Lessthan 215 Barrel" };
      });
      setData((prev) => {
        return { ...prev, qty: 0 };
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

  // calculating percentage
  let pr;
  if (data.to === "peer2peer") {
    pr = percentage.p2p;
  } else {
    pr = percentage.metalcharts;
  }
  let finalValue = data.amount - (data.amount * pr) / 100;

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

        <div className="input_group">
          <label htmlFor="duration" className="text-white">
            Completion Time:
          </label>
          <input
            type="number"
            name="duration"
            id="duration"
            placeholder="Duration in Min"
            onChange={(e) => {
              setData((prev) => {
                return { ...prev, duration: e.target.value };
              });
            }}
            value={data.duration}
          />
          {error.duration ? (
            <span className="error">{error.duration}</span>
          ) : (
            ""
          )}
        </div>

        <div className="mt-4 flex flex-col">
          <label className="text-white">Selling to?</label>

          <div className="my-2 flex">
            <div className="mr-1 flex w-1/2">
              <input
                type="radio"
                name="type"
                id="p2p"
                value="peer2peer"
                onChange={(e) => {
                  setData((prev) => {
                    return { ...prev, to: e.target.value };
                  });
                }}
                className="peer sr-only"
                checked={data.to === "peer2peer"}
              />

              <label
                htmlFor="p2p"
                className="flex h-full w-full cursor-pointer flex-col rounded-lg border-2 border-gray-300 p-2 text-blue-800
                 hover:bg-gray-100 focus:outline-none peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-green-500"
              >
                <h2 className="text-center text-base font-semibold">
                  Peer 2 Peer
                </h2>
                <p className="text-center text-xs">
                  Transaction Fee: {percentage.p2p}%
                </p>
              </label>
            </div>

            <div className="ml-1 flex w-1/2">
              <input
                type="radio"
                name="type"
                id="metalcharts"
                className="peer sr-only"
                value="metalcharts"
                onChange={(e) => {
                  setData((prev) => {
                    return { ...prev, to: e.target.value };
                  });
                }}
                checked={data.to === "metalcharts"}
              />

              <label
                htmlFor="metalcharts"
                className="flex h-full w-full cursor-pointer flex-col rounded-lg border-2 border-gray-300 p-2 text-blue-800
                 hover:bg-gray-100 focus:outline-none peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-green-500"
              >
                <h2 className="text-center text-base font-semibold">
                  Metalcharts
                </h2>
                <p className="text-center text-xs">
                  Transaction Fee: {percentage.metalcharts}%
                </p>
              </label>
            </div>
          </div>
        </div>

        {data.amount > 0 ? (
          <div className="text-white">
            <p>You will receive ${finalValue.toFixed(2)}</p>
          </div>
        ) : (
          ""
        )}

        <div className="mb-24">
          <button
            onClick={handleSubmit}
            name="request"
            type="submit"
            id="1"
            className="btn-primary m-0 mt-4 w-full cursor-pointer px-4"
          >
            Sell Now
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

export default Sell;
