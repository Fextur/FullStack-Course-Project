import { Request, Response } from "express";
import postDao from "../dao/postDao";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, image } = req.body;
    const userId = req.params.currentUserId;

    const newPost = await postDao.createPost(userId, content, image);

    return res.status(201).json(newPost);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const updatedPost = await postDao.editPost(postId, req.body);
    return res.status(200).json(updatedPost);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const removePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const result = await postDao.deletePost(postId);
    return res.status(200).json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const toggleLikePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const currentUserId = req.params.currentUserId;

    const result = await postDao.likePost(postId, currentUserId);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const currentUserId = req.params.currentUserId;

    const { userId: filterUserId } = req.params;

    if (filterUserId) {
      const posts = await postDao.fetchPostsByUserWithPagination(
        filterUserId,
        currentUserId,
        Number(page),
        Number(limit)
      );
      return res.status(200).json(posts);
    }

    const posts = await postDao.fetchPostsWithPagination(
      Number(page),
      Number(limit),
      currentUserId
    );
    return res.status(200).json(posts);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
