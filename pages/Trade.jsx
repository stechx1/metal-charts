import Image from "next/image";
import Link from "next/link";
import Trading from "./components/Trading";
import think_rich from "../public/imgs/think_rich.jpg";
import axios from "axios";

import buy from "../public/imgs/buy.png";
import sell from "../public/imgs/sell.png";
import register from "../public/imgs/registration.png";
import p2p from "../public/imgs/p2p.png";
import sellcommodity from "../public/imgs/sellcommodity.png";
import buycommodity from "../public/imgs/buycommodity.png";
import buyviap2p from "../public/imgs/buyviap2p.png";
import { useQuery } from "react-query";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useEffect } from "react";

function Trade() {
  const { isLoading, data } = useQuery("user", () => {
    return axios.get("/api/User/cookie", { staleTime: 600000 });
  });

  const [user, setUser] = useLocalStorage("user", {});

  useEffect(() => {
    async function fetchUser() {
      const response = await axios("/api/User/profile");
      // console.log(response.data);
      if (response.status == 200) {
        setUser(response.data);
      } else {
        console.log(error);
      }
    }
    fetchUser();
  }, []);

  // console.log(data);

  return (
    <>
      <Hero />
      <HowWorks data={data} />
      <P2PWorks />
      {data && data.data !== "" ? "" : <StartTrading />}
    </>
  );
}

function Hero() {
  return (
    <>
      <section className="bg-secondary min-h-screen">
        <div className="mycontainer">
          <div className="my-16 text-center">
            <h1 className="text-2xl font-extrabold text-white lg:text-5xl">
              Buy and Sell Commodities with ease
            </h1>
            <p className="mt-4 text-xl text-yellow-300">
              Trade and Make Profit in Gold and Brent Crude Oil
            </p>
          </div>

          <Trading />
        </div>
      </section>
    </>
  );
}

function HowWorks({ data }) {
  const cards = [
    {
      title: "Register Free",
      img: register,
      details: `With us you can start the journey to your financial freedom
      without any stress of payment, just come to our platform and
      register for free for life, but some of your personal information
      would be asked just to ensure the safety of your account.`,
    },
    {
      title: "Buy commodities",
      img: buy,
      details: `On our platform you can buy numerous volume of commodities you wish to stock up in your portfolio. You can currently buy Gold and Brent crude oil with any user you pleased with for safekeeping and growth of your investment.`,
    },
    {
      title: "Sell, make Profit",
      img: sell,
      details: `We give our users the advantage to explore professionally managed
      portfolios, in order to make purchasing and selling more
      efficient and effective.`,
    },
  ];
  return (
    <section className="bg-violet-200 py-20">
      <div className="mycontainer">
        <div className="flex flex-col items-center justify-between lg:flex-row">
          <div className="mb-4 w-full lg:mb-0 lg:w-[49%]">
            <h2 className="text-xl font-semibold text-blue-900 md:text-3xl">
              Invest in the Future with Confidence
            </h2>
            <p className="text-justify text-base font-light md:text-lg">
              Trade in the future with confidence MetalCharts dispatches its
              cutting edge, instinctive trading platform, empowering everybody
              to trade online. We see commodities like gold as the fate of cash
              and an impetus for making an open monetary framework all around
              the world. We allow users to trade in gold and crude oil at their
              own speed. We enable traders to enhance their portfolios much
              further and also allowing them to invest their resources into the
              global commodity market
            </p>

            <Link href={data && data.data === "" ? "/Login" : "/user/Buy"}>
              <a className="btn-primary mt-2 animate-pulse px-4">Trade Now!</a>
            </Link>
          </div>
          <div className="relative h-[280px] w-full overflow-hidden rounded-md lg:w-[49%]">
            <video controls style={{ width: "100%", height: "100%" }}>
              <source src="../intro.mp4" />
            </video>
          </div>
        </div>

        <div className="my-4 mx-auto lg:my-16">
          <h2 className="text-center text-xl font-semibold text-blue-900 md:text-3xl">
            How it Works?
          </h2>
          <p className="text-justify text-base font-light md:text-lg">
            MetalCharts facilitates trading between buyers and sellers, and we
            allow traders to stock up their commodities as long as they want for
            future purposes. We act as intermediary for the users on this
            platform which are willing to either buy or sell their commodities
            at a given price and a particular period of time.
          </p>
        </div>

        <div className="relative flex w-full flex-col justify-between lg:flex-row lg:flex-wrap">
          {cards.map((item, id) => {
            return (
              <Card
                key={id}
                title={item.title}
                img={item.img}
                details={item.details}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Card({ title, img, details }) {
  return (
    <div className="group my-4 w-full cursor-pointer rounded-md border border-blue-900 p-4 shadow-lg shadow-blue-900 transition-all duration-1000 hover:scale-105 hover:border-blue-900 hover:shadow-2xl lg:my-0 lg:w-[30%]">
      <div className="bg-primary mx-auto h-[100px] w-[100px] scale-110 rounded-full p-4 shadow-2xl shadow-blue-900 transition-all duration-1000 group-hover:scale-90 lg:h-[150px] lg:w-[150px] lg:p-8">
        <Image src={img} alt={title} placeholder="blur" />
      </div>
      <h3 className="mt-8 text-xl font-medium text-blue-900">{title}</h3>
      <p className="text-justify font-light">{details}</p>
    </div>
  );
}

function P2PWorks() {
  return (
    <section className="min-h-screen">
      <div className="mycontainer">
        <div className="my-20">
          <div className="flex flex-col items-center justify-between lg:flex-row lg:items-end">
            <div className="w-full text-justify font-light lg:w-[65%]">
              <h2 className="mb-2 text-left text-xl font-semibold text-blue-900 md:text-3xl">
                HOW TO BUY COMMODITY
              </h2>
              <p className="text-justify font-light">
                <b>We have a method of purchasing commodity:</b>
                <br />
                Purchase PEER 2 PEER
                <br />
              </p>

              <br />
              <p className="text-justify font-light">
                After you complete identity verification and add your payment
                methods, you are ready to buy commodity on the Metalcharts
                peer-to-peer platform.
                <br />
                <b>First</b>, choose from all the available offers in the
                marketplace.
                <br />
                <b>Second</b>, place an order to buy your commodity, and pay the
                seller based on the preferred payment methods.
                <br />
                <b>Lastly</b>, get your commodity from the seller after you
                complete the fiat transaction and confirm your payment on
                MetalCharts
              </p>
            </div>
            <div
              className="h-[200px] 
                w-full md:h-[200px] md:w-3/5 lg:mt-0 lg:h-[200px] lg:w-[25%] xl:h-[200px]"
            >
              <Image src={buycommodity} alt="buycommodity" />
            </div>
          </div>

          <p className="mt-2 text-justify font-light">
            <b>How to sell commodity on MetalCharts peer-to-peer?</b>
            <br />
            You can sell commodity on the peer-to-peer platform, instant and
            secure! First, browse for the commodity you wish to sell and shop
            for the best offers from other users. To place an order, you must
            first place the commodity you wish to sell into the peer-to-peer
            wallet portion of your account.
          </p>
        </div>

        <div className="my-20">
          <div className="flex flex-col items-center justify-between lg:flex-row">
            <div className="w-full text-justify font-light lg:w-[65%]">
              <h2 className="mb-2 text-xl font-semibold text-blue-900 md:text-3xl">
                SELL COMMODITY
              </h2>
              <div className="text-justify font-light">
                <p>
                  After you place an order, your commodity will be escrowed by
                  Metalcharts PEER 2 PEER.
                  <br />
                  <b>Confirm the Payment: </b>Check the transaction record in
                  the given payment account, and make sure you receive the money
                  sent by the buyer.
                  <br />
                  <b>Release Commodity </b>Once you confirm the receipt of
                  money, release commodity to the buyer on Metalcharts PEER 2
                  PEER.
                </p>
              </div>
            </div>
            <div
              className="h-[200px] 
                w-full md:h-[200px] md:w-3/5 lg:mt-0 lg:h-[200px] lg:w-[25%] xl:h-[200px]"
            >
              <Image src={sellcommodity} alt="sellcommodity" />
            </div>
          </div>
        </div>

        <div className="my-20">
          <div className="flex flex-col items-center justify-between lg:flex-row">
            <div className="w-full text-justify font-light lg:w-[70%]">
              <h2 className="mb-2 text-xl font-semibold text-blue-900 md:text-3xl">
                HOW PEER 2 PEER WORKS?
              </h2>
              <p>
                As peer-to-peer exchange is a simple platform, the overhead
                costs are negligible for buyers and sellers. On MetalCharts
                peer-to-peer, takers are charged zero trading fees, while makers
                are charged a small amount of transaction fees upon every
                completed order.
              </p>
              <p>
                We pledge to apply the lowest peer-to-peer transaction fees in
                all markets. Flexible payment methods Peer-to-peer exchanges
                allow sellers freedom to define how they want to be paid. Trade
                at your preferred prices Peer-to-peer exchanges bring users
                freedom to trade commodities at the preferred prices.
              </p>
            </div>
            <div
              className="h-[200px] 
              w-full md:h-[200px] md:w-3/5 lg:mt-0 lg:h-[200px] lg:w-[25%] xl:h-[200px]"
            >
              <Image src={p2p} alt="p2p" />
            </div>
          </div>

          <div className="mt-2 text-justify font-light">
            <p>
              On MetalCharts peer-to-peer, you can not just buy or sell
              commodities from the existing offers, but also create your trade
              advertisements to set your own prices. Protection for your privacy
              Unlike bank transfers, peer-to-peer exchanges do not collect
              information about buyers and sellers.
            </p>
            <p>
              So you can buy commodity with the method the seller provided and
              start trading on Metalcharts peer-to-peer to make a crypto-fiat
              transaction.
            </p>
          </div>
        </div>

        <div className="my-20">
          <div className="flex flex-col items-center justify-between lg:flex-row">
            <div className="w-full text-justify font-light lg:w-[65%]">
              <h2 className="mb-2 text-xl font-semibold text-blue-900 md:text-3xl">
                BUY COMMODITIES VIA PEER-TO-PEER
              </h2>

              <div className="text-justify font-light">
                <p>
                  Once you place a peer-to-peer order, the asset will be
                  escrowed by Metalcharts peer-to-peer.
                  <br />
                  <b>Pay the Seller: </b>Send money to the seller to complete
                  the fiat transaction and click
                  <i>&quot;Transferred, notify Seller&quot;</i> on Metalcharts
                  peer-to-peer.
                  <br />
                  <b>Get your Commodity </b>Once the seller confirms receipt of
                  payment, the escrowed commodity will be released to you.
                </p>
              </div>
            </div>
            <div
              className="h-[200px] 
              w-full md:h-[200px] md:w-3/5 lg:mt-0 lg:h-[200px] lg:w-[25%] xl:h-[200px]"
            >
              <Image src={buyviap2p} alt="buyviap2p" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StartTrading() {
  return (
    <section className="bg-secondary">
      <div className="mycontainer">
        <div className="flex flex-col items-center justify-between text-white lg:flex-row">
          <h3 className="text-base font-medium text-yellow-500 lg:text-xl">
            Create your MetalCharts account now to start trading
          </h3>
          <Link href="/Register">
            <a className="btn-secondary mt-4 animate-bounce px-4">
              Register Now
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Trade;
