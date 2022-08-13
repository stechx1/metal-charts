import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gold from "../../public/imgs/gold.jpg";
import crude from "../../public/imgs/crude.jpg";
import Link from "next/link";

function Trading() {
  return (
    <section>
      <div className="min-h-1/2">
        <div className="flex flex-col justify-between lg:flex-row">
          <div
            className="my-4 flex w-full flex-col overflow-hidden rounded-md bg-gray-900 shadow-2xl
                lg:my-0 lg:w-[49%]"
          >
            <div className="bg-primary flex flex-row justify-between p-4 text-white">
              <h3 className="text-xl font-medium">Trade Gold</h3>
              <div className="h-[40px] w-[40px] overflow-hidden rounded-full">
                <Image src={gold} alt="gold" />
              </div>
            </div>
            <div className="mt-2 flex flex-col p-4 text-white">
              <GetStatics type="TVC:GOLD" />

              <div className="flex flex-col justify-between md:flex-row">
                <div className="flex w-full flex-col text-blue-900 md:w-[49%]">
                  <Link href="/user/Buy">
                    <a className="btn-green py-2 text-center">Buy Now</a>
                  </Link>
                </div>

                <div className="flex w-full flex-col text-blue-900 md:w-[49%]">
                  <Link href="/user/Sell">
                    <a className="btn-red py-2 text-center">Sell Now</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div
            className="my-4 flex w-full flex-col overflow-hidden rounded-md bg-gray-900 shadow-2xl
                lg:my-0 lg:w-[49%]"
          >
            <div className="bg-primary flex flex-row justify-between  p-4 text-white">
              <h3 className="text-xl font-medium">Trade Brent Crude Oil</h3>
              <div className="h-[40px] w-[40px] overflow-hidden rounded-full">
                <Image src={crude} alt="crude" />
              </div>
            </div>
            <div className="mt-2 flex flex-col p-4 text-white">
              <GetStatics type="TVC:UKOIL" />

              <div className="flex flex-col justify-between md:flex-row">
                <div className="flex w-full flex-col text-blue-900 md:my-0 md:w-[49%]">
                  <Link href="/user/Buy">
                    <a className="btn-green py-2 text-center">Buy Now</a>
                  </Link>
                </div>

                <div className="flex w-full flex-col text-blue-900 md:my-0 md:w-[49%]">
                  <Link href="/user/Sell">
                    <a className="btn-red py-2 text-center">Sell Now</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GetStatics({ type }) {
  const container = useRef(null);
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.innerHTML = `{
         "symbol": "${type}",
         "width": "100%",
         "colorTheme": "dark",
         "isTransparent": true,
         "locale": "en",
         "style":"1",
         "timezone":"Etc/USTC",
         "interval":"D"
          }`;

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    container.current.appendChild(script);
  }, []);
  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ pointerEvents: "none" }}
    >
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default Trading;
