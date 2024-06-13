import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import logger from "../utils/logger.js";
import AppError from "../utils/appError.js";
import AppResponse from "../utils/appResponse.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

dotenv.config();

async function createUser(userData, dbClient) {
  try {
    const { email, password, username, nickname, profileImage } = userData;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await dbClient.query(
      `SELECT email FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      logger.debug(`createUser(authService): Email(${email}) already exists`);

      throw new AppError(400, `Email already exists`);
    }

    const result = await dbClient.query(
      `INSERT INTO users (email, password, username, nickname, profile_image) VALUES ($1, $2, $3, $4, $5) returning id`,
      [email, hashedPassword, username, nickname, profileImage]
    );

    const userId = result.rows[0].id;

    if (!userId) {
      throw new AppError(500, `Internal Server Error`);
    }

    logger.debug(
      `createUser(authService): New user(${email}) created with userId(${userId})`
    );

    return new AppResponse(201, `User created successfully`);
  } catch (err) {
    logger.error(`createUser(authService): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, `Internal Server Error`);
  }
}

async function loginService(loginData, dbClient) {
  try {
    const { email, password } = loginData;

    const existingUser = await dbClient.query(
      `SELECT id, email, password, role FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length == 0) {
      logger.debug(
        `loginService(authService): User with email(${email}) does not exist`
      );

      throw new AppError(404, `User does not exist`);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.rows[0].password
    );

    if (!isPasswordValid) {
      logger.debug(
        `loginService(authService): Invalid password for user with email(${email})`
      );

      throw new AppError(401, `Invaild email or password`);
    }

    const user = existingUser.rows[0];
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    logger.debug(
      `loginService(authService): User with email(${email}) successfully logged in`
    );

    return new AppResponse(200, "Login successful", {
      accessToken,
      refreshToken,
    });
  } catch (err) {
    logger.error(`loginService(authService): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, `Internal Server Error`);
  }
}

async function refreshTokenService(refreshToken) {
  try {
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    logger.debug(
      `refreshToken(authService): Refresh token verified, new access token generated`
    );

    return new AppResponse(200, "New access token generated", { accessToken });
  } catch (err) {
    logger.error(`refreshToken(authService): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, `Internal Server Error`);
  }
}

export { createUser, loginService, refreshTokenService };
