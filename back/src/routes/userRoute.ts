import { Router } from "express";
import {
  createUser,
  getUser,
  updateUser,
  loginUser,
  logoutUser,
  refreshToken,
  getChatUsers,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", createUser);
router.get("/:userId", authMiddleware, getUser);
router.put("/:userId", authMiddleware, updateUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refreshToken", refreshToken);
router.get("/chat/:userId",authMiddleware, getChatUsers)

export default router;
