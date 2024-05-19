import logger from "../utils/logger.js";
import { getUserById } from "../services/userService.js";
import { createTemplate } from "../services/templateService.js";

async function create(req, res) {
  try {
    const user = req.user;

    if (!user) {
      logger.debug("create(templateController): Unauthorized access attempt");

      return res.status(401).json({ message: `Unauthorized access attempt` });
    }

    const dbClient = req.dbClient;
    const existingUser = await getUserById(user.id, dbClient);

    if (!existingUser) {
      logger.debug(
        `create(templateController): User with id(${user.id}) does not exist`
      );

      return res.status(404).json({ message: "User does not exist" });
    }

    if (
      user.id !== existingUser.id &&
      user.email == existingUser.email &&
      user.role == existingUser.role
    ) {
      logger.debug(
        `create(templateController): User data mismatch - token user(${user.id}, ${user.email}, ${user.role}) and db user(${existingUser.id}, ${existingUser.email}, ${existingUser.role})`
      );

      return res.status(403).json({ message: "User data mismatch" });
    }

    const templateData = req.body;
    const missingFields = [];

    if (!templateData.name) missingFields.push("name");
    if (!templateData.thumbnail) missingFields.push("thumbnail");
    if (!templateData.code) missingFields.push("code");

    if (missingFields.length > 0) {
      logger.debug(
        `create(templateController): Missing required fields: ${missingFields.join(
          ", "
        )}`
      );

      return res.status(400).json({ message: `Missing required fields` });
    }

    const result = await createTemplate(templateData, user, dbClient);

    return res.status(result.status).json({ message: result.message });
  } catch (err) {
    logger.error(`create(templateController): ${err.message}`);

    if (err.status == 500) {
      return res.status(err.status).json({ message: err.message });
    }

    return res.status(err.status).json({ message: err.message });
  }
}

export { create };
