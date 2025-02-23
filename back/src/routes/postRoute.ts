import express from "express";
import {
  createPost,
  getPosts,
  toggleLikePost,
  updatePost,
  removePost,
} from "../controllers/postController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.put("/:postId", authMiddleware, updatePost);
router.delete("/:postId", authMiddleware, removePost);
router.post("/like/:postId", authMiddleware, toggleLikePost);
router.get("/:userId?", authMiddleware, getPosts);

export default router;
