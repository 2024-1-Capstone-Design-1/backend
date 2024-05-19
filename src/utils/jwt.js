import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import logger from "./logger.js";
import AppError from "./appError.js";

dotenv.config();

async function generateAccessToken(user) {
  try {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION,
      }
    );

    if (!accessToken) {
      logger.error(
        `generateAccessToken(jwtUtil): Failed to generate access token`
      );
    }

    logger.debug(
      `generateAccessToken(jwtUtil): Access token generated for userId(${user.id})`
    );

    return accessToken;
  } catch (err) {
    logger.error(`generateAccessToken(jwtUtil): ${err.message}`);

    throw new AppError(500, `Internal Server Error`);
  }
}

async function generateRefreshToken(user) {
  try {
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });

    if (!refreshToken) {
      logger.error(
        `generaterefreshToken(jwtUtil): Failed to generate refresh token`
      );
    }

    logger.debug(
      `generaterefreshToken(jwtUtil): Refresh token generated for userId(${user.id})`
    );

    return refreshToken;
  } catch (err) {
    logger.error(`generaterefreshToken(jwtUtil): ${err.message}`);

    throw new AppError(500, `Internal Server Error`);
  }
}

async function verifyToken(token) {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    logger.debug(
      `verifyToken(jwtUtil): Token verified for userId(${user.id})}`
    );

    return user;
  } catch (err) {
    logger.error(`verifyToken(jwtUtil): ${err.message}`);

    throw new AppError(401, `Invalid token`);
  }
}

export { generateAccessToken, generateRefreshToken, verifyToken };
