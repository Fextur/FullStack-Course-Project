import { SocketServise } from './socketService';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { CLIENT_URL, mongoURI, PORT } from "./constants/config";
import userRoutes from "./routes/userRoute";
import postRoutes from "./routes/postRoute";
import commentRoutes from "./routes/commentRoute";
import chatMessageRoutes from "./routes/chatMessageRoute";
import contentRoute from "./routes/contentRoute";
import cookieParser from "cookie-parser";
import http  from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now (Change in production)
    methods: ["GET", "POST"],
  },
});

const socketServise = new SocketServise()
socketServise.initSocket(io)

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/content", contentRoute);
app.use("/api/chatMessage", chatMessageRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
