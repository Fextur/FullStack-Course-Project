import  swaggerUI  from 'swagger-ui-express';
import  swaggerJsDoc  from 'swagger-jsdoc';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { CLIENT_URL, mongoURI, PORT } from "./constants/config";
import userRoutes from "./routes/userRoute";
import postRoutes from "./routes/postRoute";
import commentRoutes from "./routes/commentRoute";
import contentRoute from "./routes/contentRoute";
import cookieParser from "cookie-parser";


const app = express();

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

if (process.env.NODE_ENV === "development") {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "full stack REST API",
        version: "1.0.0",
        description: "REST server including authentication using JWT",
      },
      servers: [{ url: "http://localhost:3000" }],
    },
    apis: ["./src/routes/*.ts", "./src/swaggerDef.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
