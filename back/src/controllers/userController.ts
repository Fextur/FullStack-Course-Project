import { Request, Response } from 'express';
import userDao from '../dao/userDao';

// Controller to create a user
export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await userDao.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

// Controller to get a user by email
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await userDao.getUserByEmail(req.params.email);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

// Controller to update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await userDao.updateUserByEmail(req.params.email, req.body);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

// Controller to delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await userDao.deleteUserByEmail(req.params.email);
    if (deletedUser) {
      res.status(200).json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

