import Link from "next/link";
import { useRouter } from "next/router";
import logo from "../../public/imgs/logo.png";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import Popup from "reactjs-popup";
import AuthNav from "./AuthNav";

function Navbar({ user }) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isSubMenu, setSubMenu] = useState(false);
  const hamburger = () => {
    setIsMobile(!isMobile);
  };
  const subMenu = () => {
    setSubMenu(!isSubMenu);
  };
  const navbar = [
    { title: "About", link: "/About", blank: false },
    { title: "Trade", link: "/Trade", blank: false },
    { title: "Buy & Sell", link: "/user/Sell", blank: false },
    { title: "Trade News", link: "http://metalchartsnews.com/", blank: true },
  ];

  const { isLoading, data } = useQuery("user", () => {
    return axios.get("/api/User/cookie", { staleTime: 600000 });
  });

  if (isLoading) {
    return "Loading...";
  }

  const logOut = async () => {
    // console.log("api/User/cookie");
    const result = await axios.post("/api/User/cookie");
    // console.log(result);
    if (result.status == 204) {
      // console.log("logOut",result);
      router.push("/");
      setTimeout(() => {
        router.reload();
      }, 500);
    }
  };

  return (
    <>
      {data.data !== "" ? <AuthNav /> : ""}
      <nav className="mynav bg-primary">
        <div className="mycontainer flex flex-row flex-wrap items-center justify-between">
          <Link href="/" passHref>
            <a className="">
              <Image
                src={logo}
                alt="MetalCharts"
                width={"170px"}
                height={"40px"}
                placeholder="blur"
              />
            </a>
          </Link>

          <button
            onClick={hamburger}
            className="ml-auto inline-flex rounded p-3 text-white outline-none hover:bg-yellow-300 hover:text-white lg:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <ul
            className={`${
              isMobile ? "" : "hidden"
            } mt-4 w-full flex-row items-center lg:mt-0 lg:flex lg:w-auto`}
          >
            {navbar.map((item, id) => {
              return (
                <Listitem
                  data={item}
                  key={id}
                  active={false}
                  blank={item.blank}
                />
              );
            })}

            {data.data !== "" ? (
              <div className="relative flex flex-col">
                <Popup
                  trigger={
                    <div className="nav-item imp w-full cursor-pointer px-4">
                      {" "}
                      Dashboard{" "}
                    </div>
                  }
                  position="bottom left"
                  on="click"
                  closeOnDocumentClick
                  mouseLeaveDelay={300}
                  mouseEnterDelay={0}
                  arrow={true}
                >
                  <ul
                    className={`flex w-full min-w-[143px] flex-col overflow-hidden rounded-md bg-yellow-400`}
                  >
                    <li className="hover:bg-yellow-500">
                      <Link href="/user">
                        <a className="block p-2">Profile</a>
                      </Link>
                    </li>
                    <li className="hover:bg-yellow-500">
                      <Link href="/user/All-Trades">
                        <a className="block p-2">All Trades</a>
                      </Link>
                    </li>
                    <li className="block hover:bg-yellow-500">
                      <Link href="/user/Refferals">
                        <a className="block p-2">Refferals</a>
                      </Link>
                    </li>
                    <li className="block hover:bg-yellow-500">
                      <button onClick={() => logOut()} className="block p-2">
                        Logout?
                      </button>
                    </li>
                  </ul>
                </Popup>
              </div>
            ) : (
              <>
                <Listitem
                  data={{ title: "Login", link: "/Login" }}
                  active={false}
                  blank={false}
                />

                <Listitem
                  data={{ title: "Register", link: "/Register" }}
                  active={true}
                  blank={false}
                />
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

function Listitem({ data, active, blank }) {
  const router = useRouter();
  return (
    <li className="block lg:inline-block">
      <Link href={data.link}>
        <a
          className={`
            nav-item
            ${router.pathname == data.link ? "active" : ""}
            ${active ? "imp" : ""}
          `}
          target={blank ? "_blank" : "_self"}
        >
          {data.title}
        </a>
      </Link>
    </li>
  );
}

export default Navbar;
