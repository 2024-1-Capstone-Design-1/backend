import logger from "../utils/logger.js";
import { getUserById, getProfileService } from "../services/userService.js";

async function getProfile(req, res) {
  try {
    const user = req.user;

    if (!user) {
      logger.debug("getProfile(userController): Unauthorized access attempt");

      return res.status(401).json({ message: `Unauthorized access attempt` });
    }

    const dbClient = req.dbClient;
    const existingUser = await getUserById(user.id, dbClient);

    if (!existingUser) {
      logger.debug(
        `getProfile(userController): User with id(${user.id}) does not exist`
      );

      return res.status(404).json({ message: "User does not exist" });
    }

    if (
      user.id !== existingUser.id &&
      user.email == existingUser.email &&
      user.role == existingUser.role
    ) {
      logger.debug(
        `getProfile(userController): User data mismatch - token user(${user.id}, ${user.email}, ${user.role}) and db user(${existingUser.id}, ${existingUser.email}, ${existingUser.role})`
      );

      return res.status(403).json({ message: "User data mismatch" });
    }

    const result = await getProfileService(user, dbClient);

    return res
      .status(result.status)
      .json({ message: result.message, data: result.data });
  } catch (err) {
    logger.error(`get(userController): ${err.message}`);

    if (err.status == 500) {
      return res.status(err.status).json({ message: err.message });
    }

    return res.status(err.status).json({ message: err.message });
  }
}

export { getProfile };
