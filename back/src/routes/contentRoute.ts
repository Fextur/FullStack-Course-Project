import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { generateContent } from "../controllers/contentController";

const router = express.Router();

router.post("/generate", authMiddleware, generateContent);

export default router;
