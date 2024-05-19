import logger from "../utils/logger.js";
import AppError from "../utils/appError.js";

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

export { getUserById };
