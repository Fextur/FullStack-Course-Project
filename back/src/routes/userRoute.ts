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
router.get("/:username", authMiddleware, getUser);
router.put("/:email", authMiddleware, updateUser);
router.post("/", loginUser);
router.post("/", authMiddleware, logoutUser);
router.post("/", refreshToken);

export default router;
