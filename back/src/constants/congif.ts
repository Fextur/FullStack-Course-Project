import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

export const getToken = () => {
  if (!process.env.TOKEN_SECRET) {
    throw new Error("TOKEN_SECRET is missing from environment variables");
  }

  return process.env.TOKEN_SECRET;
};

export const getRefreshToken = () => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error(
      "REFRESH_TOKEN_SECRET is missing from environment variables"
    );
  }

  return process.env.REFRESH_TOKEN_SECRET;
};

export const getJWTexpire = () => {
  if (!process.env.TOKEN_EXPIRES) {
    throw new Error("TOKEN_EXPIRES is missing from environment variables");
  }

  return Number(process.env.TOKEN_EXPIRES) || "1h";
};
