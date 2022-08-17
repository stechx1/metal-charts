import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useInterval } from "../hooks/useInterval";
import axios from "axios";
import { useEffect, useState } from "react";
import Message from "./components/Messages/Message";

const ChatPage = () => {
  const [recieverToken, setRecieverToken] = useLocalStorage("recieverToken", "");
  const [recieverDetails, setRecieverDetails] = useState();
  const [recieverId, setRecieverId] = useState();
  const [user, setUser] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState(null);
  const [conversationId, setConversationId] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    const getRecieverDetails = async () => {
      const response = await axios("/api/Seller/details", {
        method: "POST",
        data: { sellerToken : recieverToken },
      });
      console.log("Response Data", response.data);
      setRecieverDetails(response.data);
      setRecieverId(response.data._id)
    };
    getRecieverDetails();
  }, []);

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

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/api/conversations/" + user?._id);
        setConversation(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user?._id]);

  // useEffect(() => {
  //   if (conversation !== null) {
  //     const conversations = conversation.filter(
  //       (c) =>
  //         c.members.includes(user?._id) &&
  //         c.members.includes(recieverDetails?._id)
  //     );
  //     setConversationId(conversations[0]?._id);
  //   }
  // }, [conversation]);

  useEffect(() => {
    if (conversation !== null && conversation.length > 0 &&  user?._id !== undefined && user?._id !== null && recieverDetails?._id !== undefined && recieverDetails?._id !== null) {
      console.log(conversation)
      const conversations = conversation.filter(
        (c) =>
          c.members.includes(user?._id) &&
          c.members.includes(recieverDetails?._id)
      );
      if(conversations.length == 0){
        async function createConversation(){
          const data = {
            senderId: user?._id,
            receiverId: recieverDetails?._id
          }
          const res = await axios.post("/api/conversations/create", data);
          setConversationId(res.data._id);
        }
        createConversation()
      } else {
        setConversationId(conversations[0]?._id);
        console.log("Found conversation")
      }
    }
  }, [conversation]);

  const getMessages = async () => {
    try {
      const res = await axios.get("/api/messages/" + conversationId);
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getMessages();
  }, [conversationId]);

  function Messages() {
    useInterval(() => {
      getMessages();
    }, 8000);
  }

  Messages();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId,
    };

    try {
      const res = await axios.post("/api/messages/create", message);
      setMessages([...messages, res.data]);
    } catch (err) {
      console.log(err);
    }
    setNewMessage("");
  };

  return (
    <div>
      <div className="p:2 mx-auto flex h-[600px] max-w-[900px] flex-1 flex-col justify-between overflow-y-scroll sm:p-6">
        <div className="flex justify-between border-b-2 border-gray-200 py-3 sm:items-center">
          <div className="relative flex items-center space-x-4">
            <div className="flex flex-col leading-tight">
              <div className="mt-1 flex items-center text-2xl">
                <span className="mr-3 text-gray-700">
                  Chat with {recieverDetails?.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          id="messages"
          className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex flex-col space-y-4 overflow-y-auto p-3"
        >
          {!messages.length > 0 && (
            <p className="mt-8 mb-8">Start chatting with the seller</p>
          )}

          {messages.map((m) => (
            <Message
              key={m._id}
              senderName={user?.name}
              receiverName={recieverDetails.name}
              message={m}
              own={m.sender === user?._id}
            />
          ))}

          <div className=""></div>
        </div>
        <div className="mb-2 border-t-2 border-gray-200 px-4 pt-4 sm:mb-0">
          <div className="relative flex">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              type="text"
              placeholder="Write your message!"
              className="w-full rounded-md bg-gray-200 py-3 pl-12 text-gray-600 placeholder-gray-600 focus:placeholder-gray-400 focus:outline-none"
            />
            <div className="absolute inset-y-0 right-0 hidden items-center sm:flex">
              <button
                onClick={handleSubmit}
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-4 py-3 text-white transition duration-500 ease-in-out hover:bg-blue-400 focus:outline-none"
              >
                <span>Send</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="ml-2 h-6 w-6 rotate-90 transform"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
