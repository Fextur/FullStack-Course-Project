import { Router } from "express";
import {
  createUser,
  getUser,
  updateUser,
  loginUser,
  validateToken,
  logoutUser,
  refreshToken,
  getChatUsers,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/upload";

const router = Router();

router.post("/", upload.single("image"), createUser);
router.get("/:userId", authMiddleware, getUser);
router.put("/:userId", authMiddleware, upload.single("image"), updateUser);
router.post("/login", loginUser);
router.post("/validate-token", validateToken);
router.post("/logout", logoutUser);
router.post("/refreshToken", refreshToken);
router.get("/chat/:userId", authMiddleware, getChatUsers);

export default router;
