import bcrypt from "bcrypt";
import dotenv from "dotenv";

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
      logger.debug(`createUser(service): Email(${email}) already exists`);

      throw new AppError(400, `Email already exists`);
    } else {
      const result = await dbClient.query(
        `INSERT INTO users (email, password, username, nickname, profile_image, subdomain) VALUES ($1, $2, $3, $4, $5, $6) returning id`,
        [email, hashedPassword, username, nickname, profileImage, subDomain]
      );

      const userId = result.rows[0].id;

      logger.debug(
        `createUser(service): New user(${email}) created with ID(${userId})`
      );
    }

    return AppResponse(201, `User created successfully`);
  } catch (err) {
    logger.error(`createUser(service): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, err.message);
  }
}

export { createUser };
