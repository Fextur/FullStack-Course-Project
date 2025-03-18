import { Server } from "socket.io";

// Types
interface UserSocketMap {
  [key: string]: string; // userId -> socket.id
}

interface Message {
  senderId: string;
  message: string;
  timestamp: Date;
}

interface RoomMessages {
  [key: string]: Message[]; // roomId -> Message[]
}

export class SocketServise {
  users: UserSocketMap = {}; // Store online users
  messages: RoomMessages = {}; // Store messages per conversationconst server = http.createServer(app);

  // Function to create a unique room ID (sorting ensures consistency)
  getRoomId = (user1: string, user2: string): string =>
    `room_${[user1, user2].sort().join("_")}`;

  getNotificationRoomId = (user: string): string =>
    `room_${user}_notifications`;

  initSocket = (io: Server) => {
    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      // Handle user joining with their userId
      socket.on("join", ({ userId, otherUserId }) => {
        this.users[userId] = socket.id;
        const roomId = otherUserId
          ? this.getRoomId(userId, otherUserId)
          : this.getNotificationRoomId(userId);
        socket.join(roomId);
        console.log(`User ${userId} joined room: ${roomId}`);
      });

      // Handle sending messages to a specific room
      socket.on("sendMessage", ({ senderId, receiverId, message }) => {
        const roomId = this.getRoomId(senderId, receiverId);
        const receiverNotificationRoom = this.getNotificationRoomId(receiverId);
        const senderNotificationRoom = this.getNotificationRoomId(senderId);
        console.log(`Message in ${roomId}: ${message}`);

        // Save messages
        if (!this.messages[roomId]) this.messages[roomId] = [];
        this.messages[roomId].push({
          senderId,
          message,
          timestamp: new Date(),
        });

        // Broadcast message to users in the room
        io.to(roomId).emit("receiveMessage", { senderId, message });
        io.to(receiverNotificationRoom).emit("receiveMessage", {
          senderId,
          message,
        });
        io.to(senderNotificationRoom).emit("receiveMessage", {
          senderId,
          message,
        });
      });

      // Handle user disconnect
      socket.on("disconnect", () => {
        const userId = Object.keys(this.users).find(
          (key) => this.users[key] === socket.id
        );
        if (userId) delete this.users[userId];
        console.log(`User ${userId} disconnected`);
      });
    });
  };
}
