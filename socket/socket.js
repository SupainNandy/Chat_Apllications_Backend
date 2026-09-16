import http from 'http'
import express from 'express'
import { Server } from 'socket.io'

let app = express()
let server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || ((origin, callback) => callback(null, true)),
        credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
})

// Map userId to a Set of active socket IDs
export const userSocketMap = {}

export function getReceiverSocketId(userId) {
    if (!userId || !userSocketMap[userId]) return null;
    return Array.from(userSocketMap[userId]);
}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined" && userId !== "null") {
        if (!userSocketMap[userId]) {
            userSocketMap[userId] = new Set();
        }
        userSocketMap[userId].add(socket.id);
        console.log(`User ${userId} connected with socket ${socket.id}. Active sockets: ${userSocketMap[userId].size}`);
    }

    // Broadcast current online user IDs
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        if (userId && userSocketMap[userId]) {
            userSocketMap[userId].delete(socket.id);
            if (userSocketMap[userId].size === 0) {
                delete userSocketMap[userId];
                console.log(`User ${userId} has disconnected all sockets.`);
            }
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, server, io }
