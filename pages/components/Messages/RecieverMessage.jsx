import React from "react";

const RecieverMessage = ({ recieverName, messageDetail }) => {
  return (
    <div className="chat-message">
      <div className="flex items-end">
        <div className="order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs">
          <span className="font-bold">{recieverName}</span>
          <div>
            <span className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600">
              {messageDetail}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecieverMessage;
