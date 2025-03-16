import express from "express";
import { createComment, getComments } from "../controllers/commentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createComment);
router.get("/:postId", authMiddleware, getComments);

export default router;
