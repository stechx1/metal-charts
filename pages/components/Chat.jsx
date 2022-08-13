import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import Popup from "reactjs-popup";
import chatLogo from "../../public/imgs/headset.png";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Chat() {
  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
  };

  const showpopup = () => {
    setOpen((o) => !o);
  };

  return (
    <div className="fixed right-8 bottom-8">
      <Image
        onClick={showpopup}
        src={chatLogo}
        alt="chat"
        width="50px"
        height="50px"
        className="animate-pulse cursor-pointer"
      />
      <Pop closeModal={closeModal} open={open} />
    </div>
  );
}

function Pop({ open, closeModal }) {
  const [data, setData] = useState({
    email: "",
    name: "",
    message: "",
  });

  const submitHandler = async () => {
    const response = await axios.post("/api/mail", {
      ...data,
    });

    if (response.status === 201) {
      setData({
        email: "",
        name: "",
        message: "",
      });

      toast.success("Your Message has been Sent!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(closeModal, 5000);
    } else {
      toast.error(response.data.message, {
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
    <Popup open={open} onClose={closeModal}>
      <div
        className="modal w-screen"
        style={{ backgroundColor: "rgba(0,0,0,0.5);" }}
      >
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
        <div className="mx-auto w-[90%] rounded-md bg-gray-900 py-8 px-4 md:w-1/2">
          <h1 className="mb-4 text-center text-xl font-bold text-blue-900 lg:text-3xl">
            Contact Us
          </h1>

          <div className="input_group text-white">
            <label htmlFor="email">Enter Your Email:</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={data.email}
              required={true}
              onChange={(e) => {
                setData({ ...data, email: e.target.value });
              }}
            />
          </div>

          <div className="input_group text-white">
            <label htmlFor="name">Enter Your Name:</label>
            <input
              type="name"
              name="name"
              placeholder="John Doe"
              value={data.name}
              required={true}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
              }}
            />
          </div>

          <div className="input_group text-white">
            <label htmlFor="message">Enter Your Message:</label>
            <textarea
              placeholder="Enter Your Message"
              name="message"
              required={true}
              id="message"
              cols="10"
              rows="3"
              onChange={(e) => {
                setData({ ...data, message: e.target.value });
              }}
              value={data.message}
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn-secondary px-4 "
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary px-4"
            onClick={submitHandler}
          >
            Send to Metalcharts
          </button>
        </div>
      </div>
    </Popup>
  );
}
