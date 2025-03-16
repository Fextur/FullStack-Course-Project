import { Request, Response } from "express";
import chatDao from "../dao/chatMessageDao";

export const getAllMessages = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.params.currentUserId;
      const otherUserId = req.params.otherUserId;

      const messages = await chatDao.getAllMessages(
        userId,otherUserId,
        Number(page),
        Number(limit),
      );

      return res.status(200).json(messages);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  };

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { message, otherUser } = req.body;
    const userId = req.params.currentUserId;

    const newMessage = await chatDao.createMessage(userId, otherUser, message);
    res.status(200).json(newMessage);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
