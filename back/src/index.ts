import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { SocketServise } from "./socketService";
import express from "express";
import http from "http";
import https from "https";
import mongoose from "mongoose";
import cors from "cors";
import { CLIENT_URL, mongoURI, PORT } from "./constants/config";
import userRoutes from "./routes/userRoute";
import postRoutes from "./routes/postRoute";
import commentRoutes from "./routes/commentRoute";
import chatMessageRoutes from "./routes/chatMessageRoute";
import authRoutes from "./routes/authRoute";
import contentRoute from "./routes/contentRoute";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import fs from "fs";

const app = express();
let server: http.Server;

if (process.env.NODE_ENV !== "production") {
  server = http.createServer(app);
} else {
  const options = {
    key: fs.readFileSync("../client-key.pem"),
    cert: fs.readFileSync("../client-cert.pem"),
  };
  server = https.createServer(options, app);
}

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now (Change in production)
    methods: ["GET", "POST"],
  },
});

const socketServise = new SocketServise();
socketServise.initSocket(io);

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
app.use("/api/chatMessage", chatMessageRoutes);
app.use("/api/media/", express.static("media"));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "full stack REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [{ url: "http://localhost:3000/api" }],
  },
  apis: ["./src/routes/*.ts", "./src/swaggerDef.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.static("front"));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { server };
