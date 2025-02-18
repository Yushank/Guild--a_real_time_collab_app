import { Server } from "socket.io";
import type {Socket} from "socket.io"

declare global {
    var io: Server | undefined;
}

const io = global.io || new Server(5001, {  // prevents creating multiple 5001 server and causing error
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

if (!global.io) {
    global.io = io

    io.on("connection", (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });

    });
}

export { io };