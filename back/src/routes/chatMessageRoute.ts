/**
 * @swagger
 * tags:
 *   name: ChatMessages
 *   description: The ChatMessages API
 */

import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createMessage,
  getAllMessages,
} from "../controllers/chatMessageController";

const router = express.Router();

/**
 * @swagger
 * /chatMessage:
 *   post:
 *     summary: Create a new chatMessage
 *     tags: [ChatMessages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               otherUser:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chat message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/returnedChatMessage'
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, createMessage);

/**
 * @swagger
 * /chatMessage/{otherUserId}:
 *   get:
 *     summary: Get messages for a chat
 *     tags: [ChatMessages]
 *     parameters:
 *       - in: path
 *         name: otherUserId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the other user in chat
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of messages per page
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/returnedChatMessage'
 *       500:
 *         description: Server error
 */
router.get("/:otherUserId", authMiddleware, getAllMessages);

export default router;
