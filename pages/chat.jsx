import React from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage';
import axios, { Axios } from 'axios';
import { useEffect, useState } from 'react'
import Message from './components/Messages/Message';

const ChatPage = () => {
  const [sellerToken, setSellerToken] = useLocalStorage("sellerToken", '');
  const [sellerDetails, setSellerDetails] = useState();
  const [user, setUser] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState(null);
  const [conversationId, setConversationId] = useState("");
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    const getSellerDetails = async () => {
      const response = await axios("/api/Seller/details", {
        method: "POST",
        data: {sellerToken}
      });
      console.log("Response Data", response.data)
      setSellerDetails(response.data);
    }
    getSellerDetails();
  },[]);

  useEffect(() => {
    async function fetchUser() {
      const response = await axios("/api/User/profile");
      // console.log(response.data);
      if (response.status == 200) {
        setUser(response.data);
      } else {
        console.log(error)
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const getConversations = async () => {
      try{
        const res = await axios.get("/api/conversations/"+ user?._id);
        setConversation(res.data);
      } catch (err) {
        console.log(err)
      }
    }
    getConversations();
  }, [user?._id])

  useEffect(() => {
    if(conversation !== null){
      const conversations = conversation.filter(c => c.members.includes(user?._id) && c.members.includes(sellerDetails?._id));
      setConversationId(conversations[0]?._id);
    }
  }, [conversation])

  useEffect(() => {
    const getMessages =  async() => {
      try{
        const res = await axios.get("/api/messages/" + conversationId);
        setMessages(res.data)
      } catch(err){
        console.log(err)
      }
    }
    getMessages();
  }, [conversationId])

  const handleSubmit = async(e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId
    }

    try{
      const res = await axios.post("/api/messages/create", message);
      setMessages([...messages, res.data]);
    } catch(err){
      console.log(err)
    }
    setNewMessage("")
  }

  return (
    <div>
    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col max-w-[900px] mx-auto min-h-[500px]">
   <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
      <div className="relative flex items-center space-x-4">
         <div className="flex flex-col leading-tight">
            <div className="text-2xl mt-1 flex items-center">
               <span className="text-gray-700 mr-3">Chat with {sellerDetails?.name}</span>
            </div>
         </div>
      </div>
   </div>

   <div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
    
      
      {!messages.length > 0 && (<p className="mt-8 mb-8">Start chatting with the seller</p>)}

      {messages.map(m => (
        <Message key={m._id} senderName={user?.name} receiverName={sellerDetails.name} message={m} own={m.sender === user?._id}/>
      ))}


      <div className=''>

      </div>



   </div>
   <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex">
         <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} type="text" placeholder="Write your message!" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"/>
         <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
            <button onClick={handleSubmit} type="button" className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
               <span>Send</span>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
               </svg>
            </button>
         </div>
      </div>
   </div>
</div>
</div>
  )
}

export default ChatPage;