import Link from "next/link";
function Buysell() {
  return (
    <section className="mycontainer">
      <h1 className="mt-16 text-center text-2xl font-semibold">
        Where would you like to Buy?
      </h1>
      <div className="flex flex-col items-center justify-center py-16 md:flex-row">
        <Link href="user/Buy">
          <div className="m-2 cursor-pointer rounded-md border border-gray-400 py-8 px-4 hover:shadow-xl md:w-1/3 lg:h-48">
            <h2 className="mt-10 pb-4 text-center text-2xl font-semibold">
              Peer 2 Peer
            </h2>
          </div>
        </Link>

        <span>or</span>

        <Link href="user/Buymetalcharts">
          <div className="m-2 cursor-pointer rounded-md border border-gray-400 py-8 px-4 hover:shadow-xl md:w-1/3 lg:h-48">
            <h2 className="relative mt-10 pb-4 text-center text-2xl font-semibold">
              MetalCharts
            </h2>
          </div>
        </Link>
      </div>

      <div className="text-center font-light">
        <p>
          Looking to Sell?{" "}
          <Link href="/user/Sell">
            <a className="font-medium underline hover:no-underline">Sell Now</a>
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Buysell;
