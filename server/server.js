require("dotenv").config();

const commandHistory = [];
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Store connected computers (temporary - later we'll use MongoDB)
const screenshots = new Map();
const connectedDevices = new Map();

io.on("connection", (socket) => {

    console.log("Client Connected:", socket.id);

    // System Update Command
    socket.on("system-update", (data) => {

        if (connectedDevices.has(data.deviceId)) {

            const device = connectedDevices.get(data.deviceId);

            connectedDevices.set(data.deviceId, {
                ...device,
                ...data,
                socketId: socket.id
            });

            io.emit("device-list", [...connectedDevices.values()]);
        }

    });

    //Command History
    socket.on("get-command-history", () => {

        socket.emit("command-history", commandHistory);

    });

    // Desktop Agent Registration
    socket.on("register-device", (device) => {

        connectedDevices.set(device.deviceId, {
            ...device,
            socketId: socket.id,
            status: "Online",
            lastSeen: new Date()
        });

        console.log(`${device.name} Connected`);

        io.emit("device-list", [...connectedDevices.values()]);
    });

    // Mobile App Requests Device List
    socket.on("get-devices", () => {
        socket.emit("device-list", [...connectedDevices.values()]);
    });

    // Shutdown Command
    socket.on("shutdown", (deviceId) => {

        const device = connectedDevices.get(deviceId);

        if (!device) return;

        // Save command history
        commandHistory.push({
            deviceId: device.deviceId,
            deviceName: device.name,
            command: "shutdown",
            time: new Date()
        });

        console.log(`[COMMAND] Shutdown -> ${device.name}`);

        io.to(device.socketId).emit("shutdown");

    });

    // Restart Command
    socket.on("restart", (deviceId) => {

        const device = connectedDevices.get(deviceId);

        if (!device) return;

        // Save command history
        commandHistory.push({
            deviceId: device.deviceId,
            deviceName: device.name,
            command: "restart",
            time: new Date()
        });

        console.log(`[COMMAND] Restart -> ${device.name}`);

        io.to(device.socketId).emit("restart");

    });

    // Lock Command
    socket.on("lock", (deviceId) => {

        const device = connectedDevices.get(deviceId);

        if (!device) return;

        // Save command history
        commandHistory.push({
            deviceId: device.deviceId,
            deviceName: device.name,
            command: "lock",
            time: new Date()
        });

        console.log(`[COMMAND] Lock -> ${device.name}`);

        io.to(device.socketId).emit("lock");

    });

    //Screenshot Command
    socket.on("screen-update", (data) => {

        screenshots.set(data.deviceId, data.image);

        io.emit("screen-update", data);

    });

    // Webcam Command
    socket.on("webcam-image", (data) => {

        io.emit("webcam-image", data);

    });

    // Request Screenshot Command
    socket.on("request-screenshot", (deviceId) => {

        const device = connectedDevices.get(deviceId);

        if (!device) return;

        io.to(device.socketId).emit("request-screenshot");

    });

    // Request Webcam Command
    socket.on("request-webcam", (deviceId) => {

        const device = connectedDevices.get(deviceId);

        if (!device) return;

        io.to(device.socketId).emit("request-webcam");

    });

    socket.on("disconnect", () => {

        for (const [id, device] of connectedDevices.entries()) {

            if (device.socketId === socket.id) {
                connectedDevices.delete(id);
                break;
            }

        }

        io.emit("device-list", [...connectedDevices.values()]);
    });

});

app.get("/", (req, res) => {
    res.send("ControlHub Server Running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`ControlHub Server Running on Port ${PORT}`);
});