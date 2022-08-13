import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

export default function AuthNav() {
  const [balance, setBalance] = useState({
    gold: 0,
    ukoil: 0,
  });

  const [exchanges, setExchanges] = useState({
    gold: 0,
    ukoil: 0,
  });

  useEffect(() => {
    async function fetchData() {
      //   exchanges
      const goldE = await axios.get("/api/Price/gold");
      const ukoilE = await axios.get("/api/Price/ukoil");
      //   personal balance
      const gold = await axios.get("/api/balance/gold");
      const ukoil = await axios.get("/api/balance/ukoil");

      setExchanges({
        gold: goldE.data.price ? goldE.data.price : 0,
        ukoil: ukoilE.data.price ? ukoilE.data.price : 0,
      });

      setBalance({
        gold: gold.data.amount ? gold.data.amount : 0,
        ukoil: ukoil.data.amount ? ukoil.data.amount : 0,
      });
    }

    fetchData();
    setInterval(() => {
      fetchData();
    }, 60000);
  }, []);

  return (
    <section className="bg-gray-900">
      <div className="mycontainer py-1">
        <div className="flex text-white">
          <div className="">
            <b>Gold:</b> {parseFloat(balance.gold).toFixed(5)} / $
            {(balance.gold * exchanges.gold).toFixed(2)}
          </div>
          <div className="ml-4">
            <b>Ukoil:</b> {parseFloat(balance.ukoil).toFixed(5)} / $
            {(balance.ukoil * exchanges.ukoil).toFixed(2)}
          </div>
        </div>
      </div>
    </section>
  );
}
