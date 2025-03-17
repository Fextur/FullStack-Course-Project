import jwt from "jsonwebtoken";
import {
  getJWTexpire,
  getRefreshToken,
  getRefreshTokenexpire,
  getToken,
} from "./constants/config";

type Payload = {
  _id: string;
  username: string;
  email: string;
};

export const getTokens = (payload: Payload) => {
  const accessToken = jwt.sign(payload, getToken(), {
    expiresIn: getJWTexpire(),
  });

  const refreshToken = jwt.sign(payload, getRefreshToken(), {
    expiresIn: getRefreshTokenexpire(),
  });
  return { accessToken, refreshToken };
};
