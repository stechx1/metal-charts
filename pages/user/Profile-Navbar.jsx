import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProfileNav() {
  const navlist = [
    { link: "/user", title: "Profile" },
    { link: "/user/Verification", title: "Verification" },
    { link: "/user/Security", title: "Security" },
    { link: "/user/Bank", title: "Bank Account" },
  ];
  return (
    <div className="mx-auto mt-8 w-full lg:mt-16 lg:w-[60%]">
      <ul className="flex w-full flex-row flex-wrap">
        {navlist.map((item, id) => {
          return <ListItem item={item} key={id} />;
        })}
      </ul>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

function ListItem({ item }) {
  return (
    <li>
      <Link href={`${item.link}`}>
        <a className="m-1 inline-block rounded-full border border-yellow-400 py-2 px-4 hover:bg-slate-100">
          {item.title}
        </a>
      </Link>
    </li>
  );
}

export default ProfileNav;
