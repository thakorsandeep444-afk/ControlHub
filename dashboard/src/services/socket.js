import { io } from "socket.io-client";

const socket = io("https://controlhub-eydv.onrender.com/", {
    transports: ["websocket", "polling"],
    autoConnect: true
});

export default socket;