import React from "react";

const newchat = () => {
  return (
    <>
      <h2>Sender Name</h2>
      <p>Sender Message</p>

      <h2>Recievers Name</h2>
      <p>Recievers Message</p>

      <hr />
      <input type="text" placeholder="message" />
      <button>Send</button>
    </>
  );
};

export default newchat;
