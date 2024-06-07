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

export { getUserById, getProfileService };
