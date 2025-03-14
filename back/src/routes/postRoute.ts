import express from "express";
import {
  createPost,
  getPosts,
  toggleLikePost,
  updatePost,
  removePost,
} from "../controllers/postController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/upload";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createPost);
router.put("/:postId", authMiddleware, upload.single("image"), updatePost);
router.delete("/:postId", authMiddleware, removePost);
router.post("/like/:postId", authMiddleware, toggleLikePost);
router.get("/:userId?", authMiddleware, getPosts);

export default router;
