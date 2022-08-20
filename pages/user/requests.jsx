// import { MainLayout } from "../components/layout";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useRouter } from "next/router";

export default function Transactions() {
  const [user, setUser] = useLocalStorage("user", "");
  const [recieverToken, setRecieverToken] = useLocalStorage(
    "recieverToken",
    ""
  );
  const router = useRouter();
  const columns = [
    {
      name: "Trx Id",
      selector: (row) => row.trx_id,
      sortable: true,
    },
    {
      name: "Seller",
      selector: (row) => {
        return <span className="uppercase">{row.seller}</span>;
      }, //key for data
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => {
        return row.qty.toFixed(5);
      },
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => {
        return `$${row.amount}`;
      },
      sortable: true,
    },
    {
      name: "Buyer",
      selector: (row) => {
        return <span className="uppercase">{row.buyer}</span>;
      },
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => {
        return new Date(row.created_at).toDateString();
      },
      sortable: true,
    },
    {
      name: "Trx Status",
      selector: (row) => {
        return <span className="uppercase">{row.status}</span>;
      },
      sortable: true,
    },
    {
      name: "Edit",
      selector: (row) => (
        <>
          <a
            className="cursor-pointer"
            onClick={() => {
              setRecieverToken(row.buyerToken[0]);
              router.push(`/user/view-request/${row._id}`);
            }}
            target="_blank"
          >
            <Image
              src={"/imgs/open.png"}
              alt="chat"
              width="20px"
              height="20px"
            />
          </a>
        </>
      ),
    },
    {
      name: "Chat",
      selector: (row) => (
        <>
          <a
            className="cursor-pointer"
            onClick={() => {
              setRecieverToken(row.buyerToken[0]);
              router.push("/chat");
            }}
            target="_blank"
          >
            <Image
              src={"/imgs/chat.svg"}
              alt="chat"
              width="20px"
              height="20px"
            />
          </a>
        </>
      ),
    },
  ];

  const buyColumns = [
    {
      name: "Trx Id",
      selector: (row) => row.trx_id,
      sortable: true,
    },
    {
      name: "Buyer",
      selector: (row) => {
        return <span className="uppercase">{row.buyer}</span>;
      }, //key for data
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => {
        return row.qty.toFixed(5);
      },
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => {
        return `$${row.amount}`;
      },
      sortable: true,
    },
    {
      name: "Seller",
      selector: (row) => {
        return <span className="uppercase">{row.seller}</span>;
      },
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => {
        return new Date(row.created_at).toDateString();
      },
      sortable: true,
    },
    {
      name: "Trx Status",
      selector: (row) => {
        return <span className="uppercase">{row.status}</span>;
      },
      sortable: true,
    },
    {
      name: "Chat",
      selector: (row) => (
        <>
          <a
            className="cursor-pointer"
            onClick={() => {
              setRecieverToken(row.sellerToken[0]);
              router.push("/chat");
            }}
            target="_blank"
          >
            <Image
              src={"/imgs/chat.svg"}
              alt="chat"
              width="20px"
              height="20px"
            />
          </a>
        </>
      ),
    },
  ];

  const [data, setData] = useState([]);
  const [buyData, setBuyData] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    async function fetchData() {
      console.log("User ID", user?.token);
      const response = await axios.get(`/api/Trade/admin/Sell`, {
        params: { token: user?.token },
      });
      if (response.status === 200) {
        response.data.map((item) => {
          setData((prev) => {
            return [...prev, item];
          });
        });
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      console.log("User ID", user?.token);
      const response = await axios.get(`/api/Trade/admin/Buy`, {
        params: { token: user?.token },
      });
      if (response.status === 200) {
        response.data.map((item) => {
          setBuyData((prev) => {
            return [...prev, item];
          });
        });
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {user._id ? (
        <>
          <div className="m-6 md:m-16">
            <h1 className="text-3xl font-bold border-b border-[#131722] pb-6">
              Sell Requests
            </h1>
            <DataTable
              columns={columns}
              data={data.filter((item) => {
                return (
                  item.trx_id && item.trx_id.toString().includes(filterText)
                );
              })}
              pagination
              persistTableHead
            />
          </div>

          <div className="m-6 md:m-16">
            <h1 className="text-3xl font-bold border-b border-[#131722] pb-6">
              Buy Requests Sent
            </h1>
            <DataTable
              columns={buyColumns}
              data={buyData.filter((item) => {
                return (
                  item.trx_id && item.trx_id.toString().includes(filterText)
                );
              })}
              pagination
              persistTableHead
            />
          </div>
        </>
      ) : (
        <p>Login to see requests</p>
      )}
    </>
  );
}

// Transactions.Layout = MainLayout;
