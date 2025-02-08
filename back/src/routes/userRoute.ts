import { Router } from "express";
import {
  createUser,
  getUser,
  updateUser,
  loginUser,
  logoutUser,
  refreshToken,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", createUser);
router.get("/:id", authMiddleware, getUser);
router.put("/:id", authMiddleware, updateUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.post("/refreshToken", refreshToken);

export default router;
