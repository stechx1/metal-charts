import ProfileNav from "./Profile-Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Profile() {
  return (
    <section className="min-h-screen">
      <div className="mycontainer">
        <ProfileNav />
        <UserProfile />
      </div>
    </section>
  );
}

function UserProfile() {
  const [user, setUser] = useState({
    name: " ",
    username: " ",
    email: " ",
    phone: " ",
    refferal: " ",
  });
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchUser() {
      const response = await axios("/api/User/profile");
      // console.log(response.data);
      if (response.status == 200) {
        setUser({
          ...response.data,
          refferal: response.data.refferal
            ? response.data.refferal
            : "No Refferal",
        });
      } else {
        setError(response.data.message);
      }
    }
    fetchUser();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    const response = await axios("/api/User/profile", {
      method: "POST",
      params: { name: user.name },
    });

    if (response.status == 201) {
      toast.success("Name Updated!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error("Failed to Update, try again!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 100,
      });
    }
  };

  return (
    <div className="mx-auto mt-8 flex w-full flex-col lg:w-2/3">
      <form
        className="flex w-full flex-col rounded-lg border
                 border-blue-900 px-4 py-8 shadow-xl lg:px-8 lg:py-16"
        onSubmit={submitHandler}
      >
        {error ? <p className="text-center text-red-500">{error}</p> : ""}

        <div className="flex flex-col justify-between lg:flex-row">
          <div className="input_group w-full lg:w-[49%]">
            <label htmlFor="name">Enter Your Name:</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={user.name}
              onChange={(e) => {
                setUser((prev) => {
                  return { ...prev, name: e.target.value };
                });
              }}
            />
          </div>

          <div className="input_group w-full lg:w-[49%]">
            <label htmlFor="phone">Enter Your Phone:</label>
            <input
              type="text"
              name="phone"
              disabled={true}
              value={user.phone}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between lg:flex-row">
          <div className="input_group  w-full lg:w-[49%]">
            <label htmlFor="username">Enter Your Username:</label>
            <input
              type="text"
              name="username"
              disabled={true}
              value={user.username}
            />
          </div>

          <div className="input_group  w-full lg:w-[49%]">
            <label htmlFor="refferal">Enter Referral Code:</label>
            <input
              type="refferal"
              name="refferal"
              disabled={true}
              value={user.refferal}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between lg:flex-row">
          <div className="input_group  w-full lg:w-[49%]">
            <label htmlFor="email">Enter Your Email:</label>
            <input
              type="email"
              name="email"
              disabled={true}
              value={user.email}
            />
          </div>
        </div>

        <div className="buttons">
          <button type="reset" className="btn-secondary mt-4 px-4">
            Cancel
          </button>
          <button type="submit" className="btn-primary mt-4 px-4">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
