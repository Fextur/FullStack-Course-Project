import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { mongoURI, PORT } from "./constants/config";
import userRoutes from "./routes/userRoute";

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
