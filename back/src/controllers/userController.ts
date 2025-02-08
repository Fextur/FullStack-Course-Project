import bcrypt from "bcrypt";
import { Request, Response } from "express";
import userDao from "../dao/userDao";
import User, { IUser } from "../models/userModel";
import jwt from "jsonwebtoken";
import { getToken, getJWTexpire, getRefreshToken } from "../constants/congif";

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

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await userDao.getUserByUsername(req.params.username);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await userDao.updateUserByEmail(
      req.params.email,
      req.body
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const accessToken = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      getToken(),
      { expiresIn: getJWTexpire() }
    );

    const refreshToken = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      getRefreshToken(),
      { expiresIn: getJWTexpire() }
    );

    if (user.tokens == null) user.tokens = [refreshToken];
    else user.tokens.push(refreshToken);

    await user.save();

    res.json({
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  const authorization = req.header("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, getRefreshToken()) as IUser;

    const user = await User.findOne({ id: decoded._id });

    if (!user) {
      return res.status(401).json({ message: "Invalid request" });
    }

    if (!user.tokens?.includes(token)) {
      user.tokens = [""];
      await user.save();
      return res.status(401).json({ message: "Invalid req" });
    }

    user.tokens.splice(user.tokens.indexOf(token), 1);
    await user.save();
    res.status(200).send();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const authorization = req.header("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, getRefreshToken()) as IUser;

    const user = await User.findOne({ id: decoded._id });

    if (!user) {
      return res.status(401).json({ message: "Invalid request" });
    }

    if (!user.tokens?.includes(token)) {
      user.tokens = [""];
      await user.save();
      return res.status(401).json({ message: "Invalid req" });
    }

    const accessToken = jwt.sign(
      { id: decoded._id, username: decoded.username, email: decoded.email },
      getToken(),
      { expiresIn: getJWTexpire() }
    );

    const refreshToken = jwt.sign(
      { id: decoded._id, username: decoded.username, email: decoded.email },
      getRefreshToken(),
      { expiresIn: getJWTexpire() }
    );

    user.tokens[user.tokens.indexOf(token)] = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};
