import React from 'react'

const Message = ({senderName, receiverName, message, own}) => {
  return (
    <div className="chat-message">
    <div className={`flex items-end ${own? 'justify-end': ''}`}>
       <div className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${own? 'order-1': 'order-2'} ${own? 'items-end':'items-start'}`}>
       <span className="font-bold">{own? senderName: receiverName}</span>
          <div><span className={`px-4 py-2 rounded-lg inline-block rounded-br-none ${own? 'bg-blue-600':'text-gray-600 bg-gray-300'} text-white`}>{message.text}</span></div>
       </div>
    </div>
 </div>
  )
}

export default Message