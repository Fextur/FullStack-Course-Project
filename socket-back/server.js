require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now (Change in production)
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const users = {}; // Store online users
const messages = {}; // Store messages per conversation

// Function to create a unique room ID (sorting ensures consistency)
const getRoomId = (user1, user2) => `room_${[user1, user2].sort().join("_")}`;

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user joining with their userId
  socket.on("join", ({ userId, otherUserId }) => {
    users[userId] = socket.id;
    const roomId = getRoomId(userId, otherUserId);
    socket.join(roomId);
    console.log(`User ${userId} joined room: ${roomId}`);
  });

  // Handle sending messages to a specific room
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const roomId = getRoomId(senderId, receiverId);
    console.log(`Message in ${roomId}: ${message}`);

    // Save messages
    if (!messages[roomId]) messages[roomId] = [];
    messages[roomId].push({ senderId, message, timestamp: new Date() });

    // Broadcast message to users in the room
    io.to(roomId).emit("receiveMessage", { senderId, message });
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    const userId = Object.keys(users).find((key) => users[key] === socket.id);
    if (userId) delete users[userId];
    console.log(`User ${userId} disconnected`);
  });
});

const PORT = process.env.PORT || 6565;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
