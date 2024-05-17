import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import logger from "../utils/logger.js";
import AppError from "../utils/appError.js";
import AppResponse from "../utils/appResponse.js";

dotenv.config();

async function createUser(userData, dbClient) {
  try {
    const { email, password, username, nickname, profileImage, subDomain } =
      userData;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await dbClient.query(
      `SELECT email FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      logger.debug(`createUser(authService): Email(${email}) already exists`);

      throw new AppError(400, `Email already exists`);
    } else {
      const result = await dbClient.query(
        `INSERT INTO users (email, password, username, nickname, profile_image, subdomain) VALUES ($1, $2, $3, $4, $5, $6) returning id`,
        [email, hashedPassword, username, nickname, profileImage, subDomain]
      );

      const userId = result.rows[0].id;

      logger.debug(
        `createUser(authService): New user(${email}) created with ID(${userId})`
      );
    }

    return AppResponse(201, `User created successfully`);
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
      `SELECT email, password, role FROM users WHERE email = $1`,
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

    const accessToken = await generateAccessToken(existingUser);
    const refreshToken = await generateRefreshToken(existingUser);

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
        `generateAccessToken(authService): Failed to generate access token`
      );
    }

    logger.debug(
      `generateAccessToken(authService): Access token generated for userid(${user.id})`
    );

    return accessToken;
  } catch (err) {
    logger.error(`generateAccessToken(authService): ${err.message}`);

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
        `generaterefreshToken(authService): Failed to generate refresh token`
      );
    }

    logger.debug(
      `generaterefreshToken(authService): Refresh token generated for userid(${user.id})`
    );

    return refreshToken;
  } catch (err) {
    logger.error(`generaterefreshToken(authService): ${err.message}`);

    throw new AppError(500, `Internal Server Error`);
  }
}

export { createUser, loginService };
