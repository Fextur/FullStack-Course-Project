import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createMessage, getAllMessages } from "../controllers/chatMessageController";

const router = express.Router();

router.post('/', authMiddleware, createMessage)
router.get('/:otherUserId', authMiddleware, getAllMessages)

export default router;
