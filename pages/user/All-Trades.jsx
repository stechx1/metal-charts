import Image from "next/image";
import playImg from "../../public/play.png";
import pauseImg from "../../public/pause.png";
import { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";

export default function AllTrades() {
  const [orderType, setOrderType] = useState({
    type: false,
    from: false,
  });

  const [data, setData] = useState({
    buy: "",
    sell: "",
  });

  useLayoutEffect(() => {
    async function fetchdata() {
      const response1 = await axios.get("/api/Trade/Alltrades/Buy");
      const response2 = await axios.get("/api/Trade/Alltrades/Sell");
      let sell = "";
      let buy = "";

      if (response1.status === 200) {
        buy = response1.data;
      }

      if (response2.status === 200) {
        sell = response2.data;
      }

      setData({
        buy: buy,
        sell: sell,
      });
    }
    fetchdata();
  }, []);

  return (
    <section>
      <div className="mycontainer min-h-screen">
        <div className="mx-auto mt-16 text-center">
          <h1 className="text-4xl font-bold text-blue-900">All Trades</h1>
          <p>You can check all trades history here</p>
        </div>

        <div className="mt-8 flex items-center">
          <div className="flex items-center">
            <label htmlFor="type">Order Type:</label>
            <select
              name="type"
              id="type"
              className="ml-4 cursor-pointer border p-2 shadow-md outline-none"
              onChange={(e) =>
                setOrderType({ ...orderType, type: e.target.value === "true" })
              }
            >
              <option value={false}>Buy</option>
              <option value={true}>Sell</option>
            </select>
          </div>

          <div className="ml-8 flex items-center">
            <label htmlFor="with">Trade with:</label>
            <select
              name="with"
              id="with"
              className="ml-4 cursor-pointer border p-2 shadow-md outline-none"
              onChange={(e) =>
                setOrderType({ ...orderType, from: e.target.value === "true" })
              }
            >
              <option value={false}>Metalcharts</option>
              <option value={true}>Peer2Peer</option>
            </select>
          </div>
        </div>




        {orderType.type ? (
          <SellOrders order={orderType} data={data.sell} />
        ) : (
          <BuyOrders order={orderType} data={data.buy} />
        )}
      </div>
    </section>
  );
}

function BuyOrders({ data, order }) {
  const [buy, setBuy] = useState({
    p2p: "",
    metalcharts: "",
  });
  useEffect(() => {
    (() => {
      setBuy(data);
    })();
  }, [data]);

  return (
    <div className="mt-8 flex flex-col">
      {order.from
        ? buy.p2p?.length > 0
          ? buy.p2p.map((item, id) => {
              return <BuyOrder data={item} key={id} order={order} />;
            })
          : "No data"
        : buy.metalcharts?.length > 0
        ? buy.metalcharts.map((item, id) => {
            return <BuyOrder data={item} key={id} order={order} />;
          })
        : "No data"}
    </div>
  );
}
function BuyOrder({ data, order }) {
  return (
    <div className="my-2 flex w-full items-center rounded-md border bg-slate-100 p-4 shadow-md hover:border-slate-600">
      <div className="">
        <p className="my-2">
          <b>Amount:</b> {parseInt(data.amount).toFixed(2)}$
        </p>
        <p className="my-2">
          <b>Quantity:</b> {parseFloat(data.qty).toFixed(5)}
        </p>
      </div>

      <div className="ml-10">
        <p className="my-2">
          <b>Status:</b> <span className="capitalize">{data.status}</span>
        </p>
        <p className="my-2">
          <b>Created At:</b> {new Date(data.created_at).toDateString()}
        </p>
      </div>

      <div className="ml-10">
        <p className="my-2">
          <b>Commodity-Type:</b>{" "}
          <span className="capitalize">{data.commodity}</span>
        </p>
        <p className="my-2">
          <b>Trade with:</b> {order.from ? "Peer2Peer" : "MetalCharts"}
        </p>
      </div>

      <div className="ml-10">
        <p className="my-1">
          <b>Order Id:</b> {data._id}
        </p>
        <div className="flex items-center">
          <b>Actions:</b>
          <button className="ml-4 hover:scale-105">
            <Image
              src={playImg}
              alt="play"
              title="Start"
              width="30px"
              height="30px"
            />
          </button>
          <button className="ml-4 hover:scale-105">
            <Image
              src={pauseImg}
              alt="pause"
              title="Stop"
              width="30px"
              height="30px"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function SellOrders({ data, order }) {
  const [sell, setSell] = useState(data);

  return (
    <div className="mt-8 flex flex-col">
      {order.from
        ? sell.p2p?.length > 0
          ? sell.p2p.map((item, id) => {
              return <SellOrder data={item} key={id} order={order} />;
            })
          : "No data"
        : sell.metalcharts?.length > 0
        ? sell.metalcharts.map((item, id) => {
            return <SellOrder data={item} key={id} order={order} />;
          })
        : "No data"}
    </div>
  );
}
function SellOrder({ data, order }) {
  return (
    <div className="my-2 flex w-full items-center rounded-md border bg-slate-100 p-4 shadow-md hover:border-slate-600">
      <div className="">
        <p className="my-2">
          <b>Amount:</b> {parseInt(data.amount).toFixed(2)}$
        </p>
        <p className="my-2">
          <b>Quantity:</b> {parseFloat(data.qty).toFixed(5)}
        </p>
      </div>

      <div className="ml-10">
        <p className="my-2">
          <b>Status:</b> <span className="capitalize">{data.status}</span>
        </p>
        <p className="my-2">
          <b>Created At:</b> {new Date(data.created_at).toDateString()}
        </p>
      </div>

      <div className="ml-10">
        <p className="my-2">
          <b>Commodity-Type:</b>{" "}
          <span className="capitalize">{data.commodity}</span>
        </p>
        <p className="my-2">
          <b>Trade with:</b> {order.from ? "Peer2Peer" : "MetalCharts"}
        </p>
      </div>

      <div className="ml-10">
        <p className="my-1">
          <b>Order Id:</b> {data._id}
        </p>
        <div className="flex items-center">
          <b>Actions:</b>
          <button className="ml-4 hover:scale-105">
            <Image
              src={playImg}
              alt="play"
              title="Start"
              width="30px"
              height="30px"
            />
          </button>
          <button className="ml-4 hover:scale-105">
            <Image
              src={pauseImg}
              alt="pause"
              title="Stop"
              width="30px"
              height="30px"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
