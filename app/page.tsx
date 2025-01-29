"use client"

import { useEffect, useState } from "react";
import { io } from "socket.io-client"

interface chatMessage {
  text: string
}

const socket = io("http://localhost:3000");

export default function Home(){
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<chatMessage[]>([]);

  useEffect(()=>{
    socket.on("receive_message", (data: chatMessage) =>{
      setChat((prev) => [...prev, data]);
    });

    return () =>{
      socket.off("receive_message");
    }
  });

  const sendMessage = () =>{
    const newMessage : chatMessage = {
      text: message
    }

    socket.emit("send_message", newMessage);
    setChat((prev) => [...prev, newMessage]);
    setMessage("")
  }


  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Real-Time Chat</h1>
      <div className="mt-4">
        <input 
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border rounded p-2 text-black"
        placeholder="Enter message"
        />
        <button onClick={sendMessage}
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >Send</button>
      </div>
      <div className="mt-4">
        {chat.map((msg, index) => (
          <p key={index}>{msg.text}</p>
        ))}
      </div>
    </div>
  )
}