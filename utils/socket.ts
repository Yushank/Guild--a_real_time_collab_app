import { io } from "socket.io-client";


const socket = io("http://localhost:5001");

socket.on("connect", ()=>{
    console.log("Connected to socket server")
});

socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error)
});

export default socket;