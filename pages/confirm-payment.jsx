import { useRouter } from "next/router";
import React from "react";

const ConfirmPayment = () => {
  const router = useRouter();
  return (
    <div className="my-[100px] flex">
      <div className="mx-auto max-w-[990px] content-center justify-center bg-slate-200">
        <div className="p-4">
          <p className="text-xl">
            Buyer Name sent you money in{" "}
            <span className="font-bold">Bank account name</span>
          </p>
          <p className="text-xl">
            exactly with the amount <span className="font-bold">4179 </span>
          </p>
          <p className="text-xl">
            exactly with the content <span className="font-bold"></span>
          </p>

          <p className="mt-2">Please confirm this transaction</p>
          <br />
          <br />
          <div className="flex">
            <button
              onClick={() => router.push("/chat")}
              className={`border-8 bg-white py-2 px-4 text-blue-900`}
            >
              Chat with buyer
            </button>
            <button
              onClick={() => alert("Payment has been confirmed!")}
              className={`border-8 bg-blue-900 py-2 px-4 text-white`}
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPayment;
