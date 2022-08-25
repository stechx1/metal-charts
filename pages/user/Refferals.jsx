import Image from "next/image";
import refferalImg from "../../public/imgs/refferal.png";
import earningImg from "../../public/imgs/earning.png";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import axios from "axios";

function Refferals() {
  const [user, setUser] = useState(null);

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
  return (
    <section>
      <div className="mycontainer min-h-screen">
        <div className="mx-auto mt-16 text-center">
          <h1 className="text-4xl font-bold text-blue-900">Referrals</h1>
          <p>All your referral information</p>
        </div>

        <div className="flex flex-col justify-between lg:flex-row">
          <div className="my-8 flex w-full flex-col justify-between space-y-4 md:flex-row lg:w-[49%] lg:flex-col ">
            <div className="w-full">
              <h2 className="text-2xl font-semibold text-blue-900">
                Share Your Link
              </h2>
              Share your personal referral link to social media, your blog,
              friends and everyone you can think off and earn 5$ referral bonus!
            </div>
            <div className="w-full">
              <h2 className="text-2xl font-semibold text-blue-900">
                Your unique URL
              </h2>
              <div className="flex flex-row justify-between overflow-hidden rounded-md border border-blue-900">
                <input
                  type="text"
                  value={`https://metalcharts.net/ref/${user?.refCode}`}
                  disabled={true}
                  className="w-full px-2 outline-none"
                />
                <button className="btn-primary px-4">Copy</button>
              </div>
            </div>
          </div>

          <div
            className="my-8 flex w-full flex-col justify-center space-y-4 lg:w-[49%] lg:flex-row lg:space-y-0
           lg:space-x-4"
          >
            <Card
              title={"Refferals"}
              img={refferalImg}
              val={user?.referalFriends}
              op={"Friends"}
            />
            <Card
              title={"Total Earned"}
              img={earningImg}
              val={user?.earned}
              op={"Dollars"}
            />
          </div>
        </div>

        <div className="">
          <h2 className="text-2xl font-semibold text-blue-900">
            Your Rewards History
          </h2>
          <div className="">no entry found</div>
        </div>
      </div>
    </section>
  );
}

function Card({ title, img, val, op }) {
  return (
    <div
      className="flex w-full flex-col items-center overflow-hidden rounded-md
      shadow-md transition-all duration-1000 hover:scale-105"
    >
      <div className="bg-primary flex w-full flex-row items-center justify-between px-4 py-1 text-white">
        <h4>{title}</h4>
        <Image src={img} alt={title} width="40px" height="40px" />
      </div>
      <p className="py-2 text-center lg:mt-4">
        <span className="block text-4xl text-blue-900">{val}</span> {op}
      </p>
    </div>
  );
}
export default Refferals;
