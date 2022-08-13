import React from "react";

const Message = ({ senderName, receiverName, message, own }) => {
  return (
    <div className="chat-message">
      <div className={`flex items-end ${own ? "justify-end" : ""}`}>
        <div
          className={`mx-2 flex max-w-xs flex-col space-y-2 text-xs ${
            own ? "order-1" : "order-2"
          } ${own ? "items-end" : "items-start"}`}
        >
          <span className="font-bold">{own ? senderName : receiverName}</span>
          <div>
            <span
              className={`inline-block rounded-lg rounded-br-none px-4 py-2 ${
                own ? "bg-blue-600" : "bg-gray-300 text-gray-600"
              } text-white`}
            >
              {message.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
