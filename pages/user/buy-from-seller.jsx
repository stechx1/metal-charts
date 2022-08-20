import axios, { Axios } from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const BuyFromSeller = (props) => {
  const [paidSeller, setPaidSeller] = useState(false);
  const [recieverToken, setRecieverToken] = useLocalStorage("recieverToken", "");
  const [sellerBankDetails, setSellerBankDetails] = useState();
  const [sellingCommodityDetails, setsellingCommodityDetails] = useLocalStorage(
    "sellingCommodityDetails",
    ""
  );
  const [trxId, setTrxId] = useState('');

  const router = useRouter();

  const submitHandler = async() => {
    const data = {
      trx_id: trxId,
      _id: sellingCommodityDetails._id
    }
    const response = await axios.put("/api/Trade/Sell", data);
    console.log(response);
    alert("Seller has been notified of your payment")
    router.push('/user/requests')
  }

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
      <div className="rounded mx-auto max-w-[990px] content-center justify-center bg-slate-200">
        <div className="p-6">
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
            </span> <p>Exactly with the amount<span className="font-bold">
               $ {sellingCommodityDetails.amount}
            </span></p>  <p><span className="font-bold">{(sellingCommodityDetails.commodity).toUpperCase()}</span> quantity <span className="font-bold">{sellingCommodityDetails?.qty}</span></p></p>
          <p className="text-xl">
            exactly with the content{" "}
            <span className="font-bold">{sellerBankDetails?.name}</span>
          </p>

          <p className="mt-2">to be confirmed with this transaction</p>
          <p>Pay the amount to be able to chat with the seller</p>
          <br />
          <br />
          <div className="flex">
            <button
              onClick={() =>{
                setPaidSeller(true);
              }
              }
              className={`border-8 bg-blue-900 py-2 px-4 text-white`}
            >
              I have paid the seller
            </button>
          </div>
      {paidSeller && (
        <Formik
        initialValues={{
          id: "",
        }}
        onSubmit={submitHandler}
      >
        <Form
        className="mx-auto mt-20 flex flex-col rounded-lg
            border border-blue-900 px-4 py-8 shadow-xl md:w-1/2 lg:px-8 lg:py-16"
      >
        <div className="input_group">
        <label htmlFor="id">Enter Your Transaction ID:</label>
        <Field type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)} name="id" placeholder="Transaction ID" />

        <span className="error">
          <ErrorMessage name="id" />
        </span>
      </div>

      <div className="buttons">
              <button type="submit" className="btn-primary mt-4 px-4">
                Submit
              </button>
            </div>

      </Form>
  </Formik>
      )}
        </div>
      </div>
    </div>
  );
};

export default BuyFromSeller;
