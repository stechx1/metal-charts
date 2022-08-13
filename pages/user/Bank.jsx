import axios from "axios";
import { useEffect, useState } from "react";
import ProfileNav from "./Profile-Navbar";

function Wallet({ banklist }) {
  return (
    <section className="min-h-screen">
      <div className="mycontainer">
        <ProfileNav />
        <UserWallet banklist={JSON.parse(banklist)} />
      </div>
    </section>
  );
}

function UserWallet({ banklist }) {
  // console.table(banklist);
  const [banks, setBanks] = useState(banklist);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    account: "",
    bank: "",
    type: "",
    currency: "",
  });
  const [selected, setSelected] = useState(user.id); // bank id from list
  const [error, setError] = useState();

  useEffect(() => {
    (async () => {
      // user bank details
      const response = await axios.get("/api/User/bank");
      if (response.status === 200) {
        setSelected(response.data.bankid);
        setUser({
          id: response.data.bankid,
          name: response.data.name,
          email: response.data.email,
          account: response.data.account,
          bank: response.data.bank,
          type: response.data.type,
          currency: response.data.currency,
        });
      }

      // banks details
      // const banklist = await axios.get("/api/paystack/banklist");
      // console.log(banklist);
      // if (banklist.status === 200) {
      // setBanks(banklist.data);
      // }
    })();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("Checking...");

    // get bank details
    const selectedBank = banks.filter((item) => {
      // console.log("items: ", item);
      return item.id == selected;
    });

    // verify account
    const response1 = await axios.post("/api/paystack/acc-verify", {
      acc_no: user.account,
      bank_code: selectedBank[0].code,
    });

    console.log(response1);
    // if user found in bank
    if (response1.status == 200) {
      setUser((prev) => {
        return {
          ...prev,
          name: response1.data.account_name,
        };
      });

      const data = {
        id: selected,
        account: user.account,
        email: user.email,
        name: response1.data.account_name,
        bank: selectedBank[0].code,
        type: selectedBank[0].type,
        currency: selectedBank[0].currency,
      };

      console.log("user: ", data);

      // store in db
      const response2 = await axios.post("/api/User/bank", data);
      console.log(response2);
      setError("");
    } else {
      setError("Incorrect Information");
    }
  };

  return (
    <div className="mx-auto mt-8 flex w-full flex-col lg:w-2/3">
      <form
        onSubmit={submitHandler}
        className="flex w-full flex-col rounded-lg border
                 border-blue-900 px-4 py-8 shadow-xl lg:px-8 lg:py-16"
      >
        {error ? <p className="text-center text-red-500">{error}</p> : ""}

        <div className="flex flex-col justify-between lg:flex-row">
          <div className="input_group  w-full lg:w-[49%]">
            <label htmlFor="username">Account Number:</label>
            <input
              required={true}
              type="text"
              name="account"
              value={user.account}
              placeholder="123456789"
              onChange={(e) => {
                setUser((prev) => {
                  return { ...prev, account: e.target.value };
                });
              }}
            />
          </div>

          <div className="input_group  w-full lg:w-[49%]">
            <label htmlFor="banks">Bank Name:</label>
            <select
              required={true}
              id="banks"
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
              }}
            >
              <option disabled={true} value="" hidden={true}>
                --Select Bank--
              </option>
              {banks.length ? (
                banks.map((item, id) => {
                  return (
                    <option value={item.id} key={id}>
                      {item.name}
                    </option>
                  );
                })
              ) : (
                <option disabled={true} value="" hidden={true}>
                  loading...
                </option>
              )}
            </select>
          </div>
        </div>

        <div className="flex flex-col justify-between lg:flex-row">
          <div className="input_group w-full lg:w-[49%]">
            <label htmlFor="name">Account Holder Name:</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={user.name}
              disabled={true}
            />
          </div>

          <div className="input_group  w-full lg:w-[49%]">
            <label htmlFor="email">Account Email:</label>
            <input
              placeholder="john@gmail.com"
              type="email"
              name="email"
              required={true}
              value={user.email}
              onChange={(e) => {
                setUser((prev) => {
                  return { ...prev, email: e.target.value };
                });
              }}
            />
          </div>
        </div>

        <div className="buttons">
          <button type="reset" className="btn-secondary mt-4 px-4">
            Cancel
          </button>
          <button type="submit" className="btn-primary mt-4 px-4">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
export default Wallet;

export async function getServerSideProps(context) {
  const bankResponse = await axios(`https://api.paystack.co/bank`, {
    headers: {
      Authorization: "Bearer" + process.env.SECRET_KEY,
    },
  });

  const banks = bankResponse.data.data;

  return {
    props: {
      banklist: JSON.stringify(banks),
    },
  };
}
