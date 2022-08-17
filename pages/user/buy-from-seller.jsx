import axios, { Axios } from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const BuyFromSeller = (props) => {
  const [recieverToken, setRecieverToken] = useLocalStorage("recieverToken", "");
  const [sellerBankDetails, setSellerBankDetails] = useState();
  const [sellingCommodityDetails, setsellingCommodityDetails] = useLocalStorage(
    "sellingCommodityDetails",
    ""
  );

  const router = useRouter();

  useEffect(() => {
    const getBankDetails = async () => {
      const response = await axios("/api/Seller", {
        method: "POST",
        data: { sellerToken: recieverToken },
      });
      setSellerBankDetails(response.data);
    };
    getBankDetails();
  }, []);

  return (
    <div className="my-[100px] flex">
      <div className="mx-auto max-w-[990px] content-center justify-center bg-slate-200">
        <div className="p-4">
          <p className="text-xl">
            Transfer Money To Account Number{" "}
            <span className="font-bold">{sellerBankDetails?.account}</span>
          </p>
          <p className="text-xl">
            Bank account name <span className="font-bold">Access Bank</span>{" "}
          </p>
          <p className="text-xl">
            exactly with the amount{" "}
            <span className="font-bold">
               {sellerBankDetails?.currency} 4179
            </span>
          </p>
          <p className="text-xl">
            exactly with the content{" "}
            <span className="font-bold">{sellerBankDetails?.name}</span>
          </p>

          <p className="mt-2">to be confirmed with this transaction</p>
          <br />
          <br />
          <div className="flex">
            <button
              onClick={() => router.push("/chat")}
              className={`border-8 bg-white py-2 px-4 text-blue-900`}
            >
              Chat with seller
            </button>
            <button
              onClick={() =>
                alert(
                  "Seller has been informed about your payment. Once seller approve your payment you will be redirected"
                )
              }
              className={`border-8 bg-blue-900 py-2 px-4 text-white`}
            >
              I have paid the seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyFromSeller;
