import bcrypt from "bcrypt";

import logger from "../utils/logger.js";
import AppError from "../utils/appError.js";
import AppResponse from "../utils/appResponse.js";

async function getProfileService(user, dbClient) {
  try {
    const userResult = await dbClient.query(
      `SELECT email, username, nickname, profile_image FROM users WHERE id = $1 and email = $2`,
      [user.id, user.email]
    );

    if (userResult.rows.length === 0) {
      logger.debug(
        `getProfileService(userService): User not found for id(${user.id})`
      );

      throw new AppError(404, "User not found");
    }

    const result = userResult.rows[0];

    logger.debug(
      `getProfileService(userService): User data retrieved successfully`
    );

    return new AppResponse(200, `User data retrieved successfully`, result);
  } catch (err) {
    logger.error(`getProfileService(userService): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, `Internal Server Error`);
  }
}

async function updateUserService(userUpdateData, userId, dbClient) {
  try {
    const { nickname, profileImage, password } = userUpdateData;

    const updateFields = [];
    const updateValues = [];
    let query = "UPDATE users SET ";

    if (nickname) {
      updateFields.push("nickname = $" + (updateValues.length + 1));
      updateValues.push(nickname);
    }

    if (profileImage) {
      updateFields.push("profile_image = $" + (updateValues.length + 1));
      updateValues.push(profileImage);
    }

    if (password && password.current && password.change) {
      const userResult = await dbClient.query(
        "SELECT password FROM users WHERE id = $1",
        [userId]
      );

      if (userResult.rows.length === 0) {
        logger.debug(
          `updateUserService(userService): User(${userId}) not found`
        );
        throw new AppError(404, "User not found");
      }

      const user = userResult.rows[0];
      const isMatch = await bcrypt.compare(password.current, user.password);

      if (!isMatch) {
        logger.debug(
          `updateUserService(userService): Incorrect current password for user(${userId})`
        );

        throw new AppError(403, "Incorrect current password");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password.change, salt);

      updateFields.push("password = $" + (updateValues.length + 1));
      updateValues.push(hashedPassword);
    }

    if (updateFields.length > 0) {
      query +=
        updateFields.join(", ") + " WHERE id = $" + (updateValues.length + 1);
      updateValues.push(userId);

      await dbClient.query(query, updateValues);

      logger.debug(
        `updateUserService(userService): User(${userId}) updated successfully`
      );
    }

    return { status: 200, message: "User updated successfully" };
  } catch (err) {
    logger.error(`updateUserService(userService): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, `Internal Server Error`);
  }
}

async function getUserById(userId, dbClient) {
  try {
    const result = await dbClient.query(
      "SELECT id, email, role FROM users WHERE id = $1",
      [userId]
    );

    return result.rows[0];
  } catch (err) {
    logger.error(`getUserById(userService): ${err.message}`);

    throw new AppError(500, `Internal Server Error`);
  }
}

export { getUserById, getProfileService, updateUserService };
