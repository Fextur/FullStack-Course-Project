import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import { CLIENT_URL, mongoURI, PORT } from "./constants/config";
import userRoutes from "./routes/userRoute";
import postRoutes from "./routes/postRoute";
import commentRoutes from "./routes/commentRoute";
import authRoutes from "./routes/authRoute";
import contentRoute from "./routes/contentRoute";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders:
      "Content-Type, Authorization, Cross-Origin-Opener-Policy, same-origin-allow-popups",
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
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoute);
app.use("/api/media/", express.static("media"));

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { server };
